var express           = require('express');
var expressHandlebars = require('express-handlebars');
var bodyParser       = require('body-parser');
var session           = require('express-session');
var Sequelize         = require('sequelize');
var mysql             =require('mysql');
var app               = express();
