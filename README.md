# DATAtourisme Map

This project is a map of the points of interest in France. It is based on the [DATAtourisme API](https://datatourisme.fr).

## Installation

### Setup

1. Clone the repository
1. Copy the `.env.example` file to `.env` and fill in the required values
1. If using Docker, make sure that `PG_HOST` in the `.env` file is set to `db`. Or use the `.env.docker` file instead of `.env` when running the application with Docker.
1. Download DATAtourisme feed data and extract it to the `data` folder. The structure of the `data` folder should look like this:
   ```
   data
   ├── index.json
   ├── context.jsonld
   ├── objects
   │   ├── 0
   │   │   ├── 00
   │   │   ├── 0a
   │   │   ├── ...
   │   ├── 1
   │   ├── ...
   ```

### With Docker

1. Run `docker compose up`
1. Import data by running `docker compose exec web npm run import`
1. Open your browser and go to `http://localhost:3000`

### Without Docker

1. Run `npm ci`
1. Run `npm start`
1. Import data by running `npm run import`
1. Open your browser and go to `http://localhost:3000`

## Credits

The server-side marker cluster is based on the implementation by [alfiankan](https://github.com/alfiankan) in his [medium post](https://alfiankan.medium.com/handle-millions-of-location-points-with-leaflet-without-breaking-the-browser-f69709a50861).
