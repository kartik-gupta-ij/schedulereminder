const router = require('express').Router()
const Todo_model = require('../models/todo');
const User = require('../models/User');
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Countries = require('countries-api');
const ct = require('countries-and-timezones');


router.get('/', ensureGuest, (req, res) => {
  res.render('login')
})

router.get("/profile", ensureAuth, async (req, res) => {
  // const alldata =await Todo_model.find();
  const user = await Todo_model.find({ email_: req.user.email });
  res.render('profile', { todo: user, userinfo: req.user })
})
  .post("/profile", ensureAuth, async (req, res) => {
    // const alldata =await Todo_model.find();
    const { firstName } = req.body;
    const { lastName } = req.body;
    const { contact } = req.body;
    const { country } = req.body;
    const timezone = ct.getCountry(country).timezones[0];
    const callingCode = Countries.findByCountryCode(country).data[0].callingCode[0];
    const user = await User.findById(req.user._id)
    user.firstName = firstName;
    user.lastName = lastName;
    user.contact = contact;
    user.callingCode = callingCode;
    user.displayName = `${firstName} ${lastName}`;
    user.timezone = timezone;
    user.save(function (err, updatedTodo) {
      if (err) {
        console.log(err);

      } else {
        res.redirect("/")
      }
    })
  })


router.get("/logs", ensureAuth, async (req, res) => {
  // const alldata =await Todo_model.find();
  const user = await Todo_model.find({ email_: req.user.email });
  res.render('todo', { todo: user, userinfo: req.user })
})
module.exports = router;


