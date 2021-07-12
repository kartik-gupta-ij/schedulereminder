const router = require('express').Router()
const Todo_model = require('../models/todo')
const schedule = require('node-schedule');
const User = require('../models/User');


router.post('/add/todo', (req, res) => {
    const { todo } = req.body;
    const { time } = req.body;
    const { email_ } = req.user.email;
    if (req.user.contact) {
        // const user = await User.findById(req.user._id)
        const newTodo = new Todo_model({ todo, time, email_: req.user.email })
        if (todo == "") {
            res.redirect('/')
        }
        newTodo.save()
            .then(() => {
                console.log("created")
                DeleteCron();
                whats();
                res.redirect('/')
            })
            .catch(err => console.log(err))
    } else {
        req.flash('error', 'Please enter your moblie number');
        res.redirect("/profile")
    }
})
    .get("/delete/todo/:_id", (req, res) => {
        const { _id } = req.params;
        Todo_model.deleteOne({ _id })
            .then(() => {
                console.log("deleted")
                DeleteCron();
                whats();
                res.redirect('/')
            })
            .catch((err) => console.log(err));
    })

    .get("/done/todo/:_id", async (req, res) => {
        const todo = await Todo_model.findById(req.params._id)
        todo.done = !todo.done;
        todo.save(function (err, updatedTodo) {
            if (err) {
                console.log(err);

            } else {
                DeleteCron();
                whats();
                console.log('updated')
                res.redirect("/")
            }
        })
    });


let job;
var alltodo = []
const whats = async () => {
    alltodo = await Todo_model.find();
    const arrayLength = alltodo.length;
    alltodo.forEach(async (todo, index) => {
        if (!todo.done) {
            const user = await User.find({ email: todo.email_ });
            let rule = new schedule.RecurrenceRule();

            // your timezone
            rule.tz = user[0].timezone;

            rule.second = 0;
            rule.minute = alltodo[index].time.slice(3, 5);
            rule.hour = alltodo[index].time.slice(0, 2);
            // { hour: alltodo[index].time.slice(0, 2), minute: alltodo[index].time.slice(3, 5), dayOfWeek: 4 }

            job = schedule.scheduleJob(`ID_${todo._id}`, rule, function () {
                const accountSid = 'ACd10c15f178ad9690eab52e97e7bb9df5';
                const authToken = 'a297a7cadf72423877555a90ddc4a95e';
                const client = require('twilio')(accountSid, authToken);

                client.messages
                    .create({
                        body: `${todo.todo}`,
                        from: 'whatsapp:+14155238886',
                        // to: `whatsapp:+919125224595`
                        to: `whatsapp:+${user[0].callingCode}${user[0].contact}`
                    })
                    .then(message => console.log(message.sid))
                    .done();
            });
        }
    });


}

whats()




const DeleteCron = () => {
    var jobList = schedule.scheduledJobs;

    for (jobName in jobList) {
        var job = 'jobList.' + jobName;
        eval(`${job}.cancel()`);
    }
}

// http://wa.me/+14155238886?text=join%20jack-piano

var http = require("http"); setInterval(function () { http.get("http://lit-beyond-93334.herokuapp.coms"); }, 300000); // every 5 minutes (300000)





module.exports = router;
