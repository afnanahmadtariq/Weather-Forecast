/* eslint-disable react/prop-types */
import React, { useState, useCallback } from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import { useDebounce } from '../hooks/useDebounce';
import { searchCities } from '../services/citySearch';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const debouncedQuery = useDebounce(query, 300);

  const handleSearch = useCallback((searchQuery) => {
    const results = searchCities(searchQuery);
    setSuggestions(results);
  }, []);

  const handleSelect = (city) => {
    setQuery(city.display);
    setSuggestions([]);
    onSearch({ lat: city.lat, lon: city.lon });
  };

  React.useEffect(() => {
    if (debouncedQuery) {
      handleSearch(debouncedQuery);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, handleSearch]);

  return (
    <div className="position-relative mb-4">
      <Form>
        <Form.Control
          type="text"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
      </Form>
      {suggestions.length > 0 && (
        <ListGroup className="position-absolute w-100 shadow-sm">
          {suggestions.map((city) => (
            <ListGroup.Item
              key={city.id}
              action
              onClick={() => handleSelect(city)}
              className="cursor-pointer"
            >
              {city.display}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default SearchBar;