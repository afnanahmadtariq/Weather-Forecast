import { useState } from 'react';
import { Container, Alert, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchBar from './components/SearchBar';
import WeatherGrid from './components/WeatherGrid';
import { getWeatherData } from './services/weatherApi';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // New loading state

  const handleSearch = async ({ lat, lon }) => {
    setError('');
    setLoading(true); // Set loading to true when fetching starts
    try {
      const data = await getWeatherData(lat, lon);
      setWeatherData(data);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false); // Set loading to false when fetching finishes (either success or failure)
    }
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">Weather Forecast</h1>
      <SearchBar onSearch={handleSearch} />
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      {loading ? (  // Show loading spinner if data is being fetched
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <WeatherGrid data={weatherData} />
      )}
    </Container>
  );
}

export default App;