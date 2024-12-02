import {
  WiDaySunny,
  WiDayCloudy,
  WiCloudy,
  WiRain,
  WiShowers,
  WiDayRain,
  WiSnow,
  WiStormShowers,
  WiFog,
  WiNightClear,
  WiNightCloudy,
  WiNightRain,
  WiDaySnow,
  WiNightSnow,
  WiThunderstorm
} from 'react-icons/wi';

export const getWeatherIcon = (weather, timepoint) => {
  const isNight = timepoint >= 18 || timepoint <= 6;

  const icons = {
    'clear': isNight ? WiNightClear : WiDaySunny,
    'pcloudy': isNight ? WiNightCloudy : WiDayCloudy,
    'mcloudy': WiCloudy,
    'cloudy': WiCloudy,
    'humid': WiFog,
    'lightrain': isNight ? WiNightRain : WiDayRain,
    'oshower': WiShowers,
    'ishower': WiShowers,
    'lightsnow': isNight ? WiNightSnow : WiDaySnow,
    'rain': WiRain,
    'snow': WiSnow,
    'rainsnow': WiSnow,
    'ts': WiThunderstorm,
    'tsrain': WiStormShowers
  };

  const IconComponent = icons[weather] || WiDaySunny;
  return IconComponent;
};