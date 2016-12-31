/**
 * Created by Terry on 2016-12-31.
 */
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const app = express();

hbs.registerPartials(__dirname + '/views/partials');
//app.set('key', 'value);
app.set('view engine', 'hbs');
// Custom Middleware
// whenever requesting the web server console log the time of the request.
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err) {
            console.log('Unable to append to server.log');
        }
    });
    next();
});

//Maintenance Mode
if (process.env.MAINTENANCE) {
    app.use((req, res, next) => {
        res.render('maintenance.hbs');
    });
}


hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

// take the middleware function
app.use(express.static(__dirname + '/public'));

// route set up the handler
app.get('/', (req, res) => {
   //res.send('<h1>Hello Express!</h1>');
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my website'
    });
});

app.get('/about', (req, res) => {
   res.render('about.hbs', {
       pageTitle: 'About Page'
   });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: "Big Error"
    });
});

app.listen(3000, () => {
    console.log('Server is up on port 3000');
});
