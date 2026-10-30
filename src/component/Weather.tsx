import { useEffect, useMemo, useState } from "react";
import { useClock } from "../context/ClockContext";
// import weatherData from "../../public/weather.json";

interface OpenMeteoData {
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code?: number[];
  };
  daily?: {
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
  };
}

interface WeatherProps {
  display?: "login" | "lock";
  className?: string;
  city?: string;
}

const HOUR_IN_MS = 3_600_000;

function getWeatherDescription(code?: number): string {
  if (code === undefined) return "Partly cloudy";
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Rain showers";
  if (code <= 99) return "Thunderstorm";
  return "Cloudy";
}

async function loadWeather(): Promise<OpenMeteoData | null> {
  try {
    const response = await fetch(`weather.json?t=${Date.now()}`);
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Failed to read Weather file:", error);
    return null;
  }
}

function getCurrentWeatherIndex(timesArray: string[], currentHourTimestamp: number): number {
  if (!timesArray.length) return 0;

  const startTimeMs = new Date(timesArray[0]).getTime();
  let currentIndex = Math.floor((currentHourTimestamp - startTimeMs) / HOUR_IN_MS);

  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex >= timesArray.length) currentIndex = timesArray.length - 1;

  return currentIndex;
}

export default function Weather({
  display = "login",
  className = "",
  city = "Kolkata",
}: WeatherProps) {
  const [weatherData, setWeatherData] = useState<OpenMeteoData | null>(null);
  const curTime = useClock();

  const currentHourSlot = Math.floor(curTime.getTime() / HOUR_IN_MS) * HOUR_IN_MS;

  useEffect(() => {
    const fetchAndSet = () => {
      loadWeather()
        .then((data) => setWeatherData(data))
        .catch(() => setWeatherData(null));
    };
    fetchAndSet();

    const intervalID = setInterval(fetchAndSet, 15 * 60 * 1000);

    return () => clearInterval(intervalID);
  }, []);

  const currentWeather = useMemo(() => {
    if (!weatherData?.hourly?.time) return null;

    const index = getCurrentWeatherIndex(weatherData.hourly.time, currentHourSlot);
    const temp = Math.round(((weatherData.hourly.temperature_2m[index] - 32) * 5) / 9);
    const code = weatherData.hourly.weather_code?.[index];

    // Calculate today's High & Low from the current 24-hour slice surrounding the day
    const dayStart = Math.floor(index / 24) * 24;
    const todayTemps = weatherData.hourly.temperature_2m.slice(dayStart, dayStart + 24);
    const high = todayTemps.length ? Math.round(Math.max(...todayTemps)) : temp;
    const low = todayTemps.length ? Math.round(Math.min(...todayTemps)) : temp;

    return {
      temp,
      description: getWeatherDescription(code),
      high,
      low,
      matchedTime: weatherData.hourly.time[index],
    };
  }, [weatherData, currentHourSlot]);

  if (!currentWeather) {
    return (
      <div
        className={`text-white/40 dark:text-black/40 text-xs uppercase tracking-widest animate-pulse ${className}`}
      >
        Loading weather...
      </div>
    );
  }

  if (display === "lock") {
    return (
      <div className={`flex items-center gap-2 text-sm font-medium ${className}`}>
        <span>{currentWeather.temp}&deg;</span>
        <span className="text-white/50 dark:text-black/50">&middot;</span>
        <span>{currentWeather.description}</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-8">
        <h3 className="text-[0.65rem] font-bold tracking-[0.2em] text-white/50 dark:text-black/50 uppercase mb-4">
          {city} &middot; Now
        </h3>
        <div className="flex items-center gap-6">
          <div className="text-[3.5rem] font-light leading-none tracking-tighter">
            {currentWeather.temp}&deg;
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-semibold text-sm">{currentWeather.description}</span>
            <span className="text-white/50 dark:text-black/50 text-xs mt-1">
              H {currentWeather.high}&deg; &middot; L {currentWeather.low}&deg;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
