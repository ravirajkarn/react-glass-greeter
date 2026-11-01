export const toCelsius = (f: number): number => Math.round(((f - 32) * 5) / 9);

export function getWeatherDescription(code?: number): string {
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
