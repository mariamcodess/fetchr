import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Select, MenuItem, FormControl, InputLabel, Button, Grid, Card, CardContent, CardActions, IconButton, TextField, Checkbox, ListItemText, Box } from '@mui/material';
import Pagination from '@mui/lab/Pagination';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import './Home.css';

const Home = () => {
  const [dogs, setDogs] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [zipCodes, setZipCodes] = useState([]);
  const [selectedZipCodes, setSelectedZipCodes] = useState([]);
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [match, setMatch] = useState(null);

  const fetchBreeds = useCallback(async () => {
    const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
      credentials: 'include',
    });
    const data = await response.json();
    setBreeds(data);
  }, []);

  const fetchZipCodes = useCallback(async () => {
    const zipCodesList = [
      '10001', '10002', '10003', '10004', '10005', '10006', '10007', '10008', '10009', '10010',
      '20001', '20002', '20003', '20004', '20005', '20006', '20007', '20008', '20009', '20010',
      '30001', '30002', '30003', '30004', '30005', '30006', '30007', '30008', '30009', '30010',
      '40001', '40002', '40003', '40004', '40005', '40006', '40007', '40008', '40009', '40010',
      '50001', '50002', '50003', '50004', '50005', '50006', '50007', '50008', '50009', '50010',
    ];
    setZipCodes(zipCodesList);
  }, []);

  const fetchDogs = useCallback(async () => {
    const breedsQuery = selectedBreeds.length ? `breeds=${selectedBreeds.join(',')}` : '';
    const zipCodesQuery = selectedZipCodes.length ? `zipCodes=${selectedZipCodes.join(',')}` : '';
    const ageMinQuery = ageMin ? `ageMin=${ageMin}` : '';
    const ageMaxQuery = ageMax ? `ageMax=${ageMax}` : '';
    const sortQuery = `sort=breed:${sortOrder}`;
    const query = [breedsQuery, zipCodesQuery, ageMinQuery, ageMaxQuery, sortQuery].filter(Boolean).join('&');
    
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
  }, [selectedBreeds, selectedZipCodes, ageMin, ageMax, sortOrder, page]);

  useEffect(() => {
    fetchBreeds();
    fetchZipCodes();
  }, [fetchBreeds, fetchZipCodes]);

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
      <Box component="form" className="filter-form">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
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
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Zip Codes</InputLabel>
              <Select
                multiple
                value={selectedZipCodes}
                onChange={(e) => setSelectedZipCodes(e.target.value)}
                renderValue={(selected) => selected.join(', ')}
              >
                {zipCodes.map((zipCode) => (
                  <MenuItem key={zipCode} value={zipCode}>
                    <Checkbox checked={selectedZipCodes.indexOf(zipCode) > -1} />
                    <ListItemText primary={zipCode} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="Min Age"
              type="number"
              value={ageMin}
              onChange={(e) => setAgeMin(e.target.value)}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="Max Age"
              type="number"
              value={ageMax}
              onChange={(e) => setAgeMax(e.target.value)}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Sort Order</InputLabel>
              <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={3} className="dog-cards-container">
        {dogs.map(dog => (
          <Grid item xs={12} sm={6} md={4} key={dog.id}>
            <Card className="dog-card">
              <CardContent>
                <img src={dog.img} alt={dog.name} className="dog-image" />
                <Typography variant="h5" component="div">{dog.name}</Typography>
                <Typography variant="body2" color="text.secondary">{dog.breed}</Typography>
                <Typography variant="body2" color="text.secondary">Age: {dog.age}</Typography>
                <Typography variant="body2" color="text.secondary">Location: {dog.zip_code}</Typography>
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
              <img src={match.img} alt={match.name} className="dog-image" />
              <Typography variant="h5" component="div">{match.name}</Typography>
              <Typography variant="body2" color="text.secondary">{match.breed}</Typography>
              <Typography variant="body2" color="text.secondary">Age: {match.age}</Typography>
              <Typography variant="body2" color="text.secondary">Location: {match.zip_code}</Typography>
            </CardContent>
          </Card>
        </Box>
      )}
    </Container>
  );
};

export default Home;