const express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
const path = require('path');
const User = require('./models/User');

const app = express();

// Body Parser initialising for getting the data from the submit form
app.use(bodyParser.urlencoded({extended:true}));

// Cookie-Parser for using in middleware function to Store the cookie data
app.use(cookieParser());

// Initailising Session
app.use(session({
    key:'user_sid',
    secret:'ThisIsRandomText',
    resave:false,
    saveUninitialized:false,
    cookie:{
        expires:518400000 // 6 days
    }
}))

// creating middleware
app.use((req , res , next)=>{
    if( req.session.user && req.cookies.user_sid ){
        res.redirect('/dashboard');
    }
    next();
});

const sessionChecker = ((req , res , next) => {
    if(req.session.user && req.session.user_sid ){
        res.redirect('/dashboard');
    }else{
        next();
    }
});

// making middleware working in routes
app.get('/' , sessionChecker , (req , res )=>{
    res.redirect('/login');
});

// making a login API
app.route('/login').get(sessionChecker , (req , res)=>{
    res.sendFile(path.join(__dirname , './public/login.html'));
});

// making a signup API
app.route('/signup').get(sessionChecker , (req , res)=>{
    res.sendFile(path.join(__dirname , './public/signup.html'));
})
.post((req , res)=>{
    var user = new User({
        username : req.body.username ,
        email : req.body.email ,
        password: req.body.password
    });
    user.save((err , docs)=>{
        if(err){
            res.redirect('/signup');
        }else{
        //   console.log(docs);
            req.session.user = docs ;
            res.redirect('/dashboard');
        }
    })
});

// Routes for dashboard page
app.get('/dashboard' , (req , res )=>{
    if(req.session.user && req.cookies.user ){
        res.sendFile(path.join(__dirname , '/public/dashboard.html'));
    }else{
        res.redirect('/login');
    }
})

app.set('port' , 4000);

app.listen(app.get('port') , ()=>{
    console.log(`App is listening on Port : ${app.get('port')}`);
});