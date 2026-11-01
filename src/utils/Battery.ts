export interface BatteryData {
  ac_status: boolean;
  capacity: number;
  status: "Charging" | "Discharging" | "Full" | "Unknown";
  level: number;
  name: string;
  time: string;
  watt: number;
}

export const FALLBACK_BATTERY: BatteryData = {
  ac_status: false,
  capacity: 100,
  level: 85,
  name: "BAT0",
  time: "03:45",
  watt: 12.5,
  status: "Discharging",
};
