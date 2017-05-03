/**
 * Created by nilupul on 3/8/17.
 */
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

var router = require('./routes/router');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/', express.static('weather'));
app.use(router);
app.listen(3000, function(err) {
    console.log(err);
});
