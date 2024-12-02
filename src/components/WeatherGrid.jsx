/* eslint-disable react/prop-types */
import { Row, Col, Container } from 'react-bootstrap';
import WeatherCard from './WeatherCard';
import { getDayFromIndex } from '../utils/dateUtils';

const WeatherGrid = ({ data }) => {
  if (!data?.dataseries) return null;

  return (
    <Container>
      <Row xs={1} md={2} lg={4} className="g-4">
        {data.dataseries.slice(0, 8).map((item, index) => (
          <Col key={index}>
            <WeatherCard 
              data={item} 
              date={getDayFromIndex(Math.floor(index / 2))}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default WeatherGrid;