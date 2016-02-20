var express           = require('express');
var expressHandlebars = require('express-handlebars');
var bodyParser        = require('body-parser');
var session           = require('express-session');
var Sequelize         = require('sequelize');
var mysql             = require('mysql');
var passport          = require('passport');
var passportLocal     = require('passport-local');
var bcrypt            = require('bcryptjs');
var app               = express();

// Connects to database
var sequelize = new Sequelize('events_db', 'root');
// bodyParser to read info from HTML
app.use(bodyParser.urlencoded({extended: false}));
// setting default layout to main.handlebars
app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}));
// setting view to all handlebar pages
app.set('view engine','handlebars');

app.use(session({
  secret: 'go shawty its your birfday', //Random string of text
  cookie:{
    maxAge: 1000 * 60 * 60 * 24 * 14 //sets length of login
  },
  saveUninitialized: true,
  resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

//passport use methed as callback when being authenticated
passport.use(new passportLocal.Strategy(function(username, password, done) {
    //check password in db
    User.findOne({
        where: {
            username: username
        }
    }).then(function(user) {
        //check password against hash
        if(user){
            bcrypt.compare(password, user.dataValues.password, function(err, user) {
                if (user) {
                  //if password is correct authenticate the user with cookie
                  done(null, { id: username, username: username });
                } else{
                  done(null, null);
                }
            });
        } else {
            done(null, null);
        }
    });

}));

//change the object used to authenticate to a smaller token, and protects the server from attacks
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    done(null, { id: id, username: id })
});

app.use(bodyParser.urlencoded({
    extended: false
}));

var User = connection.define('user', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [5,10],
        msg: "Your password must be between 5-10 characters"
      },
      isUppercase: true
    }
  }
}, {
  hooks: {
    beforeCreate: function(input){
      input.password = bcrypt.hashSync(input.password, 10);
    }
  }
});



app.get('/', function(req, res){
  res.render('home'); //show register.handlebars
});

app.get('/login', function(req, res){
  res.render('login'); //show login.handlebars
});
