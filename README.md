# Fetchr App

## Overview

Fetchr App is a web application that allows users to search for dogs available for adoption. Users can filter search results by breed, zip code, age, and sort order. The application fetches data from an external API and displays the results in a user-friendly interface. Users can also mark their favorite dogs and generate a match based on their favorites.

## Features

- User authentication (login and logout)
- Search for dogs by breed, zip code, and age
- Sort search results by breed, name, or age
- Mark dogs as favorites
- Generate a match based on favorite dogs

## Technologies Used

- React.js
- Node.js
- Express.js
- Axios
- Material-UI

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fetchr-app.git
   cd fetchr-app

2. Install dependencies for the client:
    cd client
    npm install

### Running the Application

1. Start react app
    ```bash
    npm start
    The app will start on http://localhost:3000.

2. start the server
    ```bash
    cd server.js
    node server.js
    The server will start on http://localhost:3000.


## API Endpoints

# Authentication
Login
URL: /auth/login
   ```bash
Method: POST
Body: { "name": "John Doe", "email": "john@example.com" }
Response: { "message": "Login successful" }
```
Logout
URL: /auth/logout
```bash
Method: POST
Response: { "message": "Logout successful" }
```
Dogs
Get Breeds
URL: /dogs/breeds
```bash
Method: GET
Response: A list of dog breeds.
```

# Search Dogs
URL: /dogs/search
```bash
Method: GET
Query Parameters:
breeds: An array of breeds.
zipCodes: An array of zip codes.
ageMin: A minimum age.
ageMax: A maximum age.
size: The number of results to return (default: 25).
from: A cursor to be used when paginating results (optional).
sort: The field by which to sort results, and the direction of the sort (e.g., sort=breed:asc).
Response: An object with the search results and total count.
```
Match Dogs
URL: /dogs/match
```bash
Method: POST
Body: { "favoriteIds": [1, 2, 3] }
Response: A matched dog.
```


# Locations
Search Locations
URL: /locations/search
```bash
Method: POST
{
  "city": "San Francisco",
  "states": ["CA"],
  "geoBoundingBox": {
    "top_left": { "lat": 37.812, "lon": -122.3482 },
    "bottom_right": { "lat": 37.7038, "lon": -122.527 }
  },
  "size": 25,
  "from": 0
}
Response: { "results": [...], "total": 100 }
```
