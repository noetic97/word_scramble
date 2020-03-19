require('dotenv').config();
const express = require('express');
const path = require('path');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
exports.db = require('knex')(configuration);
const router = require('./server/router');

// const client = new FtpClient();
const port = process.env.PORT || 5000;
const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.use('/api/v1', router);

// The "catchall" handler: for any request that doesn't
// match one above, send back main index.html file.
app.get('*', (req, res) => {
  // res.send('what???', 404);
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.listen(port);
console.log(`Word Scramble is listening on ${port}`); //eslint-disable-line

exports.app = app;
