import React, { useState, useEffect } from 'react';
import './Homepage.css';

export const Homepage = () => {
    const [breeds, setBreeds] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchParams, setSearchParams] = useState({
      breeds: [],
      zipCodes: [],
      ageMin: '',
      ageMax: '',
    });
  
    useEffect(() => {
      const fetchBreeds = async () => {
        try {
          const response = await fetch('http://localhost:3000/dogs/breeds', {
            method: 'GET',
            credentials: 'include',
          });
          if (response.ok) {
            const data = await response.json();
            setBreeds(data);
          } else {
            console.error('Error fetching breeds', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching breeds', error);
        }
      };
  
      fetchBreeds();
    }, []);
  
    const handleSearch = async () => {
      try {
        const params = new URLSearchParams(searchParams);
        const response = await fetch(`http://localhost:3000/dogs/search?${params.toString()}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.resultIds);
        } else {
          console.error('Error searching dogs', response.statusText);
        }
      } catch (error) {
        console.error('Error searching dogs', error);
      }
    };
  
    return (
      <div className="homePage">
        <h1>Dog Finder Database</h1>
        <div className="search">
          <h2>Search Dogs</h2>
          <div className="search-field">
            <label>Breeds:</label>
            <select
              multiple
              value={searchParams.breeds}
              onChange={(e) =>
                setSearchParams({
                  ...searchParams,
                  breeds: Array.from(e.target.selectedOptions, (option) => option.value),
                })
              }
            >
              {breeds.map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>
          </div>
          <div className="search-field">
            <label>Zip Codes:</label>
            <input
              type="text"
              value={searchParams.zipCodes}
              onChange={(e) =>
                setSearchParams({
                  ...searchParams,
                  zipCodes: e.target.value.split(','),
                })
              }
            />
          </div>
          <div className="search-field">
            <label>Age Min:</label>
            <input
              type="number"
              value={searchParams.ageMin}
              onChange={(e) =>
                setSearchParams({
                  ...searchParams,
                  ageMin: e.target.value,
                })
              }
            />
          </div>
          <div className="search-field">
            <label>Age Max:</label>
            <input
              type="number"
              value={searchParams.ageMax}
              onChange={(e) =>
                setSearchParams({
                  ...searchParams,
                  ageMax: e.target.value,
                })
              }
            />
          </div>
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className="results">
          <h2>Search Results</h2>
          <ul>
            {searchResults.map((resultId) => (
              <li key={resultId}>{resultId}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

export default Homepage;