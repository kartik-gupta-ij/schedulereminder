const router = require('express').Router()
const Todo_model = require('../models/todo');
const User = require('../models/User');
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Countries = require('countries-api');


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
    const { number } = req.body;
    const { country } = req.body;
    const data = Countries.findByCountryCode(country);
    const [countryCode] = data.data[0].callingCode
    const contact = `${countryCode}${number}`
    const user = await User.findById(req.user._id)
    user.firstName = firstName;
    user.lastName = lastName;
    user.contact = contact;
    user.number = number;
    user.displayName = `${firstName} ${lastName}`
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


