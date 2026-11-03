#!/usr/bin/env bash
set -euo pipefail

THEME_NAME="react-glass-greeter"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST_DIR="${PROJECT_DIR}/dist"
THEMES_DIR="/usr/share/web-greeter/themes"
TARGET_DIR="${THEMES_DIR}/${THEME_NAME}"
GREETER_CONF="/etc/lightdm/web-greeter.yml"
LIGHTDM_USER="lightdm"

MODE="copy"
if [[ "${1:-}" == "--symlink" || "${1:-}" == "-s" ]]; then
  MODE="symlink"
fi

echo "==> [1/4] Building ${THEME_NAME} production bundle..."
cd "${PROJECT_DIR}"

if command -v pnpm >/dev/null 2>&1; then
  pnpm install --frozen-lockfile || pnpm install
  pnpm run build
elif command -v npm >/dev/null 2>&1; then
  npm install
  npm run build
else
  echo "Error: Neither pnpm nor npm was found in PATH." >&2
  exit 1
fi

if [[ ! -f "${DIST_DIR}/index.html" ]]; then
  echo "Error: Build failed or ${DIST_DIR}/index.html was not generated." >&2
  exit 1
fi

echo "==> [2/4] Deploying theme to ${TARGET_DIR} (${MODE} mode)..."
sudo mkdir -p "${THEMES_DIR}"

# Remove existing directory or symlink cleanly before deploying
if [[ -L "${TARGET_DIR}" || -e "${TARGET_DIR}" ]]; then
  sudo rm -rf "${TARGET_DIR}"
fi

if [[ "${MODE}" == "symlink" ]]; then
  if ! command -v setfacl >/dev/null 2>&1; then
    echo "Installing 'acl' package via apt for symlink permissions..."
    sudo apt-get update && sudo apt-get install -y acl
  fi

  sudo ln -s "${DIST_DIR}" "${TARGET_DIR}"

  # Grant traverse (+x) permissions to lightdm on every parent directory up to /
  CURRENT_PATH="${PROJECT_DIR}"
  while [[ "${CURRENT_PATH}" != "/" && "${CURRENT_PATH}" != "/home" ]]; do
    sudo setfacl -m "u:${LIGHTDM_USER}:x" "${CURRENT_PATH}"
    CURRENT_PATH="$(dirname "${CURRENT_PATH}")"
  done

  # Grant read + execute permissions to lightdm on dist/
  sudo setfacl -R -m "u:${LIGHTDM_USER}:rx" "${DIST_DIR}"
  sudo setfacl -d -R -m "u:${LIGHTDM_USER}:rx" "${DIST_DIR}"
else
  sudo mkdir -p "${TARGET_DIR}"
  sudo cp -r "${DIST_DIR}/." "${TARGET_DIR}/"
  sudo chown -R root:root "${TARGET_DIR}"
  sudo find "${TARGET_DIR}" -type d -exec chmod 755 {} +
  sudo find "${TARGET_DIR}" -type f -exec chmod 644 {} +
fi

echo "==> [3/4] Configuring ${GREETER_CONF}..."
if [[ -f "${GREETER_CONF}" ]]; then
  BACKUP_FILE="${GREETER_CONF}.bak.$(date +%Y%m%d%H%M%S)"
  sudo cp "${GREETER_CONF}" "${BACKUP_FILE}"
  echo "    Backed up config to ${BACKUP_FILE}"

  # Update active theme line (ignoring commented-out # theme: lines)
  sudo sed -i -E "s|^([[:space:]]*theme:[[:space:]]*).*|\1${THEME_NAME}|" "${GREETER_CONF}"
else
  echo "    Warning: ${GREETER_CONF} not found. Skipping config update."
fi

echo "==> [4/4] Verifying read access for user '${LIGHTDM_USER}'..."
if id "${LIGHTDM_USER}" >/dev/null 2>&1; then
  if sudo -u "${LIGHTDM_USER}" test -r "${TARGET_DIR}/index.html"; then
    echo "    Success: '${LIGHTDM_USER}' can read ${TARGET_DIR}/index.html"
  else
    echo "    Error: '${LIGHTDM_USER}' cannot read ${TARGET_DIR}/index.html!" >&2
    exit 1
  fi
fi

echo ""
echo "Installation complete!"
echo "  - Preview in window: nody-greeter --debug"
echo "  - Test real lock:    dm-tool lock"