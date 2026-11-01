import { useEffect, useMemo, useState } from "react";
import { getWeatherDescription, toCelsius } from "../utils/Weather";

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

async function loadWeather(): Promise<OpenMeteoData | null> {
  try {
    const response = await fetch(`weather.json?t=${Date.now()}`);
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("[Weather] Failed to fetch weather:", error);
    return null;
  }
}

function getCurrentWeatherIndex(timesArray: string[], currentTimestamp: number): number {
  if (!timesArray.length) return 0;
  const startTimeMs = new Date(timesArray[0]).getTime();
  const currentIndex = Math.floor((currentTimestamp - startTimeMs) / HOUR_IN_MS);
  return Math.max(0, Math.min(currentIndex, timesArray.length - 1));
}

export default function Weather({
  display = "login",
  className = "",
  city = "Kolkata",
}: WeatherProps) {
  const [weatherData, setWeatherData] = useState<OpenMeteoData | null>(null);
  const [lastCheck, setLastCheck] = useState<number>(() => Date.now());

  useEffect(() => {
    const fetchAndSet = () => {
      loadWeather()
        .then((data) => setWeatherData(data))
        .catch(() => setWeatherData(null));
      setLastCheck(Date.now());
    };

    fetchAndSet();
    const intervalID = setInterval(fetchAndSet, 15 * 60 * 1000);
    return () => clearInterval(intervalID);
  }, []);

  const currentWeather = useMemo(() => {
    if (!weatherData?.hourly?.time?.length) return null;

    const index = getCurrentWeatherIndex(weatherData.hourly.time, lastCheck);
    const rawTempF = weatherData.hourly.temperature_2m[index];
    const temp = toCelsius(rawTempF);
    const code = weatherData.hourly.weather_code?.[index];

    // Compute 24-hour day slice in uniform Celsius
    const dayStart = Math.floor(index / 24) * 24;
    const todayTempsF = weatherData.hourly.temperature_2m.slice(dayStart, dayStart + 24);
    const high = todayTempsF.length ? toCelsius(Math.max(...todayTempsF)) : temp;
    const low = todayTempsF.length ? toCelsius(Math.min(...todayTempsF)) : temp;

    return {
      temp,
      high,
      low,
      description: getWeatherDescription(code),
    };
  }, [weatherData, lastCheck]);

  if (!currentWeather) {
    return (
      <div className={`text-white/40 text-xs uppercase tracking-widest animate-pulse ${className}`}>
        Loading weather...
      </div>
    );
  }

  if (display === "lock") {
    return (
      <div className={`flex items-center gap-2 text-sm font-medium ${className}`}>
        <span>{currentWeather.temp}&deg;</span>
        <span className="text-white/50">&middot;</span>
        <span>{currentWeather.description}</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-8">
        <h3 className="text-[0.65rem] font-bold tracking-[0.2em] text-white/50 uppercase mb-4">
          {city} &middot; Now
        </h3>
        <div className="flex items-center gap-6">
          <div className="text-[3.5rem] font-light leading-none tracking-tighter">
            {currentWeather.temp}&deg;
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-semibold text-sm">{currentWeather.description}</span>
            <span className="text-white/50 text-xs mt-1">
              H {currentWeather.high}&deg; &middot; L {currentWeather.low}&deg;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
