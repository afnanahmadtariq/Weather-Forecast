import Fuse from 'fuse.js';
import { cities } from '../data/cities';

const fuseOptions = {
  keys: ['name', 'country'],
  threshold: 0.3,
  includeScore: true
};

const fuse = new Fuse(cities, fuseOptions);

export const searchCities = (query) => {
  if (!query || query.length < 2) return [];
  
  const results = fuse.search(query);
  return results
    .slice(0, 5)
    .map(result => result.item);
};