/* eslint-disable react/prop-types */
import { Card } from 'react-bootstrap';
import { getWeatherIcon } from '../utils/weatherIcons';
import { formatTime } from '../utils/dateUtils';
import { WiHumidity, WiStrongWind } from 'react-icons/wi';

const WeatherCard = ({ data, date }) => {
  const WeatherIcon = getWeatherIcon(data.weather, data.timepoint);

  return (
    <Card className="h-100 weather-card">
      <Card.Body className="text-center">
        <h5 className="mb-3">{date}</h5>
        <div className="weather-icon mb-3">
          <WeatherIcon size={48} />
        </div>
        <h4 className="temperature">{data.temp2m}°C</h4>
        <div className="weather-details">
          <p className="mb-2">
            <WiHumidity className="me-1" size={20} />
            <span>{data.rh2m}%</span>
          </p>
          <p className="mb-2">
            <WiStrongWind className="me-1" size={20} />
            <span>{data.wind10m.speed} m/s</span>
          </p>
          <p className="time">{formatTime(data.timepoint)}</p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default WeatherCard;