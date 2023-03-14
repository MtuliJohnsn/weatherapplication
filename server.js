const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

const apiKey = 'f51e9a8a8b712c067ced1901a4da2568';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', { weather: null, error: null });
})

app.post('/', function (req, res) {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

  request(url, function (err, response, body) {
    if (err) {
      res.render('index', { weather: null, error: 'Error, please try again' });
    } else {
      let weather = JSON.parse(body);
      if (weather.main == undefined || weather.weather == undefined || weather.weather.length == 0) {
        res.render('index', { weather: null, error: 'Error, please try again' });
      } else {
        let observationTime = new Date(weather.dt * 1000).toLocaleTimeString();
        let weatherData = {
          city: weather.name,
          country: weather.sys.country,
          temperature: weather.main.temp,
          description: weather.weather[0].description,
          icon: weather.weather[0].icon,
          wind: weather.wind.speed
        };
        let weatherText = `${weatherData.city}, ${weatherData.country} at ${observationTime}. Temperature ${weatherData.temperature} degrees Fahrenheit. Condition ${weatherData.description}. Wind speed ${weatherData.wind} mph.`;

        res.render('index', { weather: weatherData, weatherText: weatherText, error: null });
      }
    }
  });
})

const port = process.env.PORT || 8002;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
