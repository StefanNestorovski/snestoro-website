const express = require('express');
const app = express();

app.use(express.static( __dirname + '/../app'));

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(80);