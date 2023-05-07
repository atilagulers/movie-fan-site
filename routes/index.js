const {parse} = require('dotenv');
var express = require('express');
var router = express.Router();
const request = require('request');

router.use((req, res, next) => {
  res.locals.imageBaseUrl = process.env.imageBaseUrl;
  next();
});

/* GET home page. */
router.get('/', function (req, res, next) {
  request.get(process.env.nowPlayingUrl, (error, response, movieData) => {
    const parsedData = JSON.parse(movieData);

    res.render('index', {
      parsedData: parsedData.results,
    });
  });
});

router.get('/movie/:id', (req, res, next) => {
  const movieId = req.params.id;
  const movieUrl = `${process.env.apiBaseUrl}/movie/${movieId}?api_key=${process.env.apiKey}`;

  request.get(movieUrl, (error, response, movieData) => {
    const parsedData = JSON.parse(movieData);

    res.render('singleMovie', {
      parsedData,
    });
  });
});

router.post('/search', (req, res, next) => {
  const userSearchTerm = encodeURI(req.body.movieSearch);
  const category = req.body.category;
  const movieUrl = `${process.env.apiBaseUrl}/search/${category}?query=${userSearchTerm}&api_key=${process.env.apiKey}`;

  request.get(movieUrl, (error, response, movieData) => {
    const parsedData = JSON.parse(movieData);

    if (category === 'person') {
      parsedData.results = parsedData.results[0].known_for;
    }

    res.render('index', {
      parsedData: parsedData.results,
    });
  });
});

module.exports = router;
