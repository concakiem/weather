const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config()

// console.log(process.env);

const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const allData = new Datastore('database.db');
allData.loadDatabase();
// allData.insert({ "name": "rain", "stuff": "rainbow" })

app.get('/api', (request, response) => {
    allData.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    });
});

app.post('/api', (request, response) => {
    console.log("got a request");
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    allData.insert(data);
    // console.log(allData);

    response.json({
        status: 'success',
        mood: data.mood,
        timestamp: timestamp,
        image64: data.image64,
        latitude: data.lat,
        longitude: data.lon
    });
});

app.get('/weather/:latlon', async (request, response) => {
    console.log(request.params);
    const latlon = request.params.latlon.split(',');
    console.log(latlon);
    const lat = latlon[0];
    const lon = latlon[1];
    console.log(lat, lon);
    const api_key = process.env.API_KEY;
    console.log(api_key);
    const weather_api = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`; ///?units=si
    //const url_api = `http://api.openweathermap.org/data/2.5/weather?appid=1a850c7395c22a522e65d9c6775e1cc4&lat=14.3406675&lon=107.9807771`;
    const weather_response = await fetch(weather_api);
    const weather_data = await weather_response.json();

    const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
    //const url_api = `http://api.openweathermap.org/data/2.5/weather?appid=1a850c7395c22a522e65d9c6775e1cc4&lat=14.3406675&lon=107.9807771`;
    const aq_response = await fetch(aq_url);
    const aq_data = await aq_response.json();

    const data = {
        weather: weather_data,
        air_quality: aq_data
    };
    response.json(data);
});
