/* eslint-disable react/prop-types */
import { Card } from 'react-bootstrap';
import { getWeatherIcon } from '../utils/weatherIcons';
import { WiHumidity, WiStrongWind } from 'react-icons/wi';

const WeatherCard = ({ data, date }) => {
  const WeatherIcon = getWeatherIcon(data.weather, data.timepoint);

  return (
    <Card className="weather-card shadow border-0">
      <Card.Body className="text-center">
        <h6 className="date mb-2">{date}</h6>
        <div className="weather-icon mb-3">
          <WeatherIcon size={64} />
        </div>
        <h2 className="temperature mb-3">{data.temp2m}°C</h2>
        <div className="weather-details">
          <p className="mb-2 d-flex align-items-center justify-content-center">
            <WiHumidity className="me-2" size={20} />
            {data.rh2m}%
          </p>
          <p className="d-flex align-items-center justify-content-center">
            <WiStrongWind className="me-2" size={20} />
            {data.wind10m.speed} m/s
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default WeatherCard;
