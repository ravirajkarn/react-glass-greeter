import React, { useEffect, useState } from "react";
import { TbBatteryVerticalEco } from "react-icons/tb";
import {
  MdOutlinePower,
  MdBatteryUnknown,
  MdBatteryAlert,
  MdBatteryChargingFull,
  MdBatteryFull,
  MdBattery20,
  MdBattery30,
  MdBattery50,
  MdBattery60,
  MdBattery80,
  MdBattery90,
  MdBatteryCharging20,
  MdBatteryCharging30,
  MdBatteryCharging50,
  MdBatteryCharging60,
  MdBatteryCharging80,
  MdBatteryCharging90,
} from "react-icons/md";
import { greeter } from "../services/WebGreeter";

const batteryIcons: Record<string, React.ElementType> = {
  MdBattery20,
  MdBattery30,
  MdBattery50,
  MdBattery60,
  MdBattery80,
  MdBattery90,
  MdBatteryCharging20,
  MdBatteryCharging30,
  MdBatteryCharging50,
  MdBatteryCharging60,
  MdBatteryCharging80,
  MdBatteryCharging90,
};

export interface BatteryProps {
  className?: string;
}

interface IconProps {
  className?: string;
  level: number;
  status: string;
  hasBattery: boolean;
}

const PowerIcon = ({ level, className = "", status, hasBattery }: IconProps) => {
  if (!hasBattery) return <MdOutlinePower className={className} />;
  if (!status || status === "unknown") return <MdBatteryUnknown className={className} />;

  if (level < 20 && status !== "charging") return <MdBatteryAlert className={className} />;

  if (status === "not charging") return <TbBatteryVerticalEco className={className} />;

  if (level > 95) {
    return status === "charging" ? (
      <MdBatteryChargingFull className={className} />
    ) : (
      <MdBatteryFull className={className} />
    );
  }

  const levels = [90, 80, 60, 50, 30, 20];
  const match = levels.find((lvl) => level >= lvl) || 20;

  const iconName = status === "charging" ? `MdBatteryCharging${match}` : `MdBattery${match}`;

  const IconComponent = batteryIcons[iconName] || MdBatteryUnknown;

  return <IconComponent className={className} />;
};

export default function Battery({ className = "" }: BatteryProps) {
  const hasBattery = greeter.canAccessBattery();

  const [batteryState, setBatteryState] = useState(() => {
    if (!hasBattery) return { level: 0, status: "unknown" };
    const data = greeter.batteryData();
    return {
      level: Math.max(0, Math.min(100, Number(data.level) || 0)),
      status: (data.status || "unknown").toLowerCase(),
    };
  });

  useEffect(() => {
    if (!hasBattery) return;

    const syncBattery = () => {
      const data = greeter.batteryData();
      setBatteryState({
        level: Math.max(0, Math.min(100, Number(data.level) || 0)),
        status: (data.status || "unknown").toLowerCase(),
      });
    };

    syncBattery();

    return greeter.onBatteryUpdate(syncBattery);
  }, [hasBattery]);

  const isCritical = hasBattery && batteryState.level < 20 && batteryState.status !== "charging";

  return (
    <div
      aria-label={
        hasBattery
          ? `Battery ${batteryState.level}%, ${batteryState.status}`
          : "Connected to AC power"
      }
      className={`inline-flex items-center gap-1.5 select-none ${
        isCritical ? "text-red-400 font-semibold" : ""
      } ${className}`}
    >
      {hasBattery && <span>{batteryState.level}%</span>}
      <PowerIcon
        hasBattery={hasBattery}
        status={batteryState.status}
        level={batteryState.level}
        className="text-xl rotate-90"
      />
    </div>
  );
}
