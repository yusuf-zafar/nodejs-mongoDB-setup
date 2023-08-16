const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const fileUpload = require('express-fileupload');
const errorMiddleware = require('./middleware/error');
const passport = require('passport');
const session = require('express-session');
require('./middleware/passport')


// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(fileUpload());
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


// Route imports
const user = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes')

app.use('/api/v1',user);
app.use('/', authRoutes);


// Error Middleware
app.use(errorMiddleware);

module.exports = app;