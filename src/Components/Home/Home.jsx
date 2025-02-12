import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Select, MenuItem, FormControl, InputLabel, Button, Grid, Card, CardContent, CardActions, IconButton, TextField, Checkbox, ListItemText, Box } from '@mui/material';
import Pagination from '@mui/lab/Pagination';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import './Home.css';

const Home = () => {
  const [dogs, setDogs] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [selectedZipCodes, setSelectedZipCodes] = useState([]);
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [match, setMatch] = useState(null);
  const [city, setCity] = useState('');
  const [states, setStates] = useState([]);

  const fetchBreeds = useCallback(async () => {
    const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
      credentials: 'include',
    });
    const data = await response.json();
    setBreeds(data);
  }, []);

  const fetchDogs = useCallback(async () => {
    const breedsQuery = selectedBreeds.length ? `breeds=${selectedBreeds.join(',')}` : '';
    const zipCodesQuery = selectedZipCodes.length ? `zipCodes=${selectedZipCodes.join(',')}` : '';
    const ageMinQuery = ageMin ? `ageMin=${ageMin}` : '';
    const ageMaxQuery = ageMax ? `ageMax=${ageMax}` : '';
    const sortQuery = `sort=breed:${sortOrder}`;
    const cityQuery = city ? `city=${city}` : '';
    const statesQuery = states.length ? `states=${states.join(',')}` : '';
    const query = [breedsQuery, zipCodesQuery, ageMinQuery, ageMaxQuery, sortQuery, cityQuery, statesQuery].filter(Boolean).join('&');
    
    const response = await fetch(`https://frontend-take-home-service.fetch.com/dogs/search?size=25&from=${(page-1)*25}&${query}`, {
      credentials: 'include',
    });
    const data = await response.json();
    const dogIds = data.resultIds;

    const dogsResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dogIds),
      credentials: 'include',
    });
    const dogsData = await dogsResponse.json();
    setDogs(dogsData);
  }, [selectedBreeds, selectedZipCodes, ageMin, ageMax, sortOrder, page, city, states]);

  useEffect(() => {
    fetchBreeds();
  }, [fetchBreeds]);

  useEffect(() => {
    fetchDogs();
  }, [fetchDogs]);

  const handleFavoriteToggle = (id) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter(fav => fav !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const generateMatch = async () => {
    const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(favorites),
      credentials: 'include',
    });
    const data = await response.json();
    const matchResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([data.match]),
      credentials: 'include',
    });
    const matchData = await matchResponse.json();
    setMatch(matchData[0]);
  };

  return (
<Container className="search-container">
  <Typography variant="h4" gutterBottom>Search Dogs</Typography>
  <Box component="form" className="search-form">
    <FormControl fullWidth margin="normal">
      <InputLabel>Breeds</InputLabel>
      <Select
        multiple
        value={selectedBreeds}
        onChange={(e) => setSelectedBreeds(e.target.value)}
        renderValue={(selected) => selected.join(', ')}
      >
        {breeds.map((breed) => (
          <MenuItem key={breed} value={breed}>
            <Checkbox checked={selectedBreeds.indexOf(breed) > -1} />
            <ListItemText primary={breed} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <TextField
      label="City"
      type="text"
      value={city}
      onChange={(e) => setCity(e.target.value)}
      fullWidth
      margin="normal"
    />
    <FormControl fullWidth margin="normal">
      <InputLabel>States</InputLabel>
      <Select
        multiple
        value={states}
        onChange={(e) => setStates(e.target.value)}
        renderValue={(selected) => selected.join(', ')}
      >
        {['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'].map((state) => (
          <MenuItem key={state} value={state}>
            <Checkbox checked={states.indexOf(state) > -1} />
            <ListItemText primary={state} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <TextField
      label="Min Age"
      type="number"
      value={ageMin}
      onChange={(e) => setAgeMin(e.target.value)}
      fullWidth
      margin="normal"
    />
    <TextField
      label="Max Age"
      type="number"
      value={ageMax}
      onChange={(e) => setAgeMax(e.target.value)}
      fullWidth
      margin="normal"
    />
    <FormControl fullWidth margin="normal">
      <InputLabel>Sort Order</InputLabel>
      <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
        <MenuItem value="asc">Ascending</MenuItem>
        <MenuItem value="desc">Descending</MenuItem>
      </Select>
    </FormControl>
  </Box>
  <Grid container spacing={3} className="dog-cards-container">
    {dogs.map(dog => (
      <Grid item xs={12} sm={6} md={4} key={dog.id}>
        <Card className="dog-card">
          <CardContent>
            <img src={dog.img} alt={dog.name} style={{ width: '100%', height: 'auto' }} />
            <Typography variant="h5" component="div">{dog.name}</Typography>
            <Typography variant="body2" color="text.secondary">{dog.breed}</Typography>
            <Typography variant="body2" color="text.secondary">Age: {dog.age}</Typography>
            <Typography variant="body2" color="text.secondary">Location: {dog.city}, {dog.state} {dog.zip_code}</Typography>
          </CardContent>
          <CardActions>
            <IconButton onClick={() => handleFavoriteToggle(dog.id)}>
              {favorites.includes(dog.id) ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
    ))}
  </Grid>
  <Box className="pagination-container">
    <Pagination count={10} page={page} onChange={(e, value) => setPage(value)} />
  </Box>
  <Button variant="contained" color="primary" onClick={generateMatch} disabled={favorites.length === 0} className="generate-match-button">
    Generate Match
  </Button>
  {match && (
    <Box className="match-container">
      <Typography variant="h5">Match Found!</Typography>
      <Card className="dog-card">
        <CardContent>
          <img src={match.img} alt={match.name} style={{ width: '100%', height: 'auto' }} />
          <Typography variant="h5" component="div">{match.name}</Typography>
          <Typography variant="body2" color="text.secondary">{match.breed}</Typography>
          <Typography variant="body2" color="text.secondary">Age: {match.age}</Typography>
          <Typography variant="body2" color="text.secondary">Location: {match.city}, {match.state} {match.zip_code}</Typography>
        </CardContent>
      </Card>
    </Box>
  )}
</Container>
  );
};

export default Home;