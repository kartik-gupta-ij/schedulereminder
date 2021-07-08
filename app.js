const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const dotenv = require('dotenv')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const Todo_model = require('./models/todo');
const flash = require('connect-flash');


var app = express();
const PORT = process.env.PORT || 3000;
dotenv.config({ path: './config/config.env' })
// Connect to mongodb
// mongoose.connect("mongodb://localhost/todo_list",{
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// Passport config
require('./config/passport')(passport)



// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.set('view engine', 'ejs');

app.use(
  session({
    secret: 'k545114521212cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
)


app.use(flash());

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())



app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})


app.use(require("./routes/index"))
app.use('/auth', require('./routes/auth'))
app.use(require("./routes/todo"))





app.listen(PORT, console.log(`listening at ${PORT}`))
