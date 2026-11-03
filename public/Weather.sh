#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Fetch the data and pipe it into jq to ensure it's valid JSON, then save it locally
curl -s "https://api.open-meteo.com/v1/forecast?latitude=22&longitude=79&hourly=temperature_2m,rain,snowfall,precipitation,precipitation_probability,wind_speed_80m,wind_direction_80m,uv_index,weather_code&forecast_days=16&temperature_unit=fahrenheit" | jq '.' > $SCRIPT_DIR/public/weather.json