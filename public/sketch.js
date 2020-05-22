// Geo locate
if ("geolocation" in navigator) {
    console.log("geolocation avaliable");
    navigator.geolocation.getCurrentPosition(async function (position) {
        try {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            document.getElementById('latitude').textContent = lat.toFixed(2);
            document.getElementById('longitude').textContent = lon.toFixed(2);
            // const url_api = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=1a850c7395c22a522e65d9c6775e1cc4`
            //const url_api = `http://api.openweathermap.org/data/2.5/weather?appid=1a850c7395c22a522e65d9c6775e1cc4&lat=${lat}&lon=${lon}`
            const url_api = `/weather/${lat},${lon}`;
            //const url_api = `/weather`;
            const response = await fetch(url_api);
            const json = await response.json();
            console.log(json);
            const weather = json.weather.weather[0]
            document.getElementById('main').textContent = weather.description;
            document.getElementById('name').textContent = json.weather.name;

            const air = json.air_quality.results[0].measurements[0];
            document.getElementById('aq_parameter').textContent = air.parameter;
            document.getElementById('aq_value').textContent = air.value;
            document.getElementById('aq_units').textContent = air.units;
            document.getElementById('aq_date').textContent = air.lastUpdated;
            console.log(json);
            const data = { lat, lon, weather, air };
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            };
            const db_response = await fetch('/api', options);
            console.log(db_response);
            const db_json = await db_response.json();
            console.log(db_json);
        } catch (error) {
            console.error(error);
            // console.log('something went wrong');
            document.getElementById('aq_value').textContent = 'NO READING';
        }
    })
} else {
    console.log("geolocation not avaliable")
};

//submit data to database

// let lat, lon;
// const button = document.getElementById('checkin');
// button.addEventListener('click', async event => {
//     const mood = document.getElementById('mood').value;
//     video.loadPixels();
//     const image64 = video.canvas.toDataURL();

// });

