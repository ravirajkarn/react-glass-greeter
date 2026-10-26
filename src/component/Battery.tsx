import { lightdm } from "nody-greeter-types";
import { useEffect, useState } from "react";
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

interface BatteryProps {
  className?: string;
}

interface IconProps {
  className?: string;
  level?: number;
  status?: string;
}

const PowerIcon = ({ level = 0, className = "", status = "unknown" }: IconProps) => {
  if (!lightdm.can_access_battery) return <MdOutlinePower className={className} />;
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
  const [battery, setBattery] = useState<number>(0);
  const [status, setStatus] = useState<string>("unknown");

  useEffect(() => {
    if (!lightdm.can_access_battery || !lightdm.battery_data) return;

    const updateBatteryState = () => {
      setBattery(lightdm.battery_data.level);
      setStatus(lightdm.battery_data.status.toLowerCase());
    };

    updateBatteryState();

    lightdm.battery_update?.connect(updateBatteryState);

    return () => {
      lightdm.battery_update?.disconnect(updateBatteryState);
    };
  }, []);

  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-1">
        <span>{battery}%</span>
        <PowerIcon status={status} level={battery} className="text-xl rotate-90" />
      </div>
    </div>
  );
}
