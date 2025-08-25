export function mapOwmToIcon(weatherId: number, isNight: boolean = false): string {
  // Thunderstorm
  if (weatherId >= 200 && weatherId <= 232) return "/weather/storm.png";
  // Drizzle
  if (weatherId >= 300 && weatherId <= 321) return "/weather/drizzle.png";
  // Rain
  if (weatherId >= 500 && weatherId <= 504) return "/weather/light rain.png";
  if (weatherId === 511) return "/weather/rainy.png"; // freezing rain placeholder
  if (weatherId >= 520 && weatherId <= 531) return "/weather/showers.png";
  // Snow
  if (weatherId >= 600 && weatherId <= 622) return "/weather/snow.png";
  // Atmosphere (mist, smoke, haze, fog, sand, dust, ash, squall, tornado)
  if (weatherId >= 700 && weatherId <= 781) return "/weather/cloudy.png";
  // Clear
  if (weatherId === 800) return isNight ? "/weather/Clear Night.png" : "/weather/sunny.png";
  // Clouds
  if (weatherId === 801 || weatherId === 802) return isNight ? "/weather/Partly Cloudy Night.png" : "/weather/partly-cloudy.png";
  if (weatherId === 803 || weatherId === 804) return "/weather/cloudy.png";
  // Fallback
  return "/weather/windy.png";
}

export function isNightFromIconCode(icon?: string): boolean {
  // OWM icon codes end with 'd' for day and 'n' for night
  return icon?.endsWith("n") ?? false;
}

export function formatLocalTime(tsSec: number, tzOffsetSec: number, options: Intl.DateTimeFormatOptions = {}): string {
  // Convert to milliseconds and adjust by timezone offset
  const utcMs = tsSec * 1000;
  const localMs = utcMs + tzOffsetSec * 1000;
  const d = new Date(localMs);
  // Only default to showing time if caller didn't request specific date/time parts
  const hasDatePart = ("weekday" in options) || ("year" in options) || ("month" in options) || ("day" in options);
  const hasTimePart = ("hour" in options) || ("minute" in options) || ("second" in options);
  const fmt: Intl.DateTimeFormatOptions = (!hasDatePart && !hasTimePart)
    ? { hour: "numeric", minute: "2-digit", hour12: true, ...options }
    : options;
  return d.toLocaleString(undefined, fmt);
}

export function formatDayName(tsSec: number, tzOffsetSec: number): string {
  const now = Date.now();
  const todayStartLocal = new Date(now).setHours(0, 0, 0, 0);
  const dayStr = formatLocalTime(tsSec, tzOffsetSec, { weekday: "short" });
  // If the date is today in local tz, show "Today"
  const localDateStr = formatLocalTime(tsSec, tzOffsetSec, { year: "numeric", month: "2-digit", day: "2-digit" });
  const todayLocalStr = new Date(todayStartLocal).toLocaleString(undefined, { year: "numeric", month: "2-digit", day: "2-digit" });
  return localDateStr === todayLocalStr ? "Today" : dayStr;
}

export function toKm(meters?: number | null): string {
  if (meters == null) return "-";
  return `${(meters / 1000).toFixed(0)} km`;
}

export function toPct(value?: number | null): string {
  if (value == null) return "-";
  return `${Math.round(value * 100)}%`;
}
