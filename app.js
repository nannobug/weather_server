const express = require('express');
const axios = require('axios');

const config = require('./config.js');

const app = express();

const port = 3000;

app.get('/local/:zipcode', (req, res) => {
    const zipCode = req.params.zipcode;
    const API_TOKEN = config.TOKEN;
    const countryCode = req.params.countryCode || 'us';

    const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},${countryCode}&appid=${API_TOKEN}`;

    axios
        .get(url)
        .then(response => {
            // convert temperature from K to F
            const high_temp_in_kelvin = response.data.main.temp_max;
            const low_temp_in_kelvin = response.data.main.temp_min;
            const high_temp_in_fahrenheit = Math.round((high_temp_in_kelvin - 273.15) * 9 / 5 + 32);
            const low_temp_in_fahrenheit = Math.round((low_temp_in_kelvin - 273.15) * 9 / 5 + 32);

            // write result
            const result = {
                "city": response.data.name,
                "conditions": response.data.weather[0].description,
                "high_temp": high_temp_in_fahrenheit,
                "low_temp": low_temp_in_fahrenheit
            };
            res.status(200).json(result);

        })
        .catch(err => {
            res.status(404).send(`Failed to fetch weather data for ${zipCode}`);
        });
})

app.listen(port, () => {
    console.log('Listen to port', port);
})

module.exports = app;