const mongoose = require('mongoose');

const Todo = require('./models/todo');

mongoose.connect('mongodb://localhost:27017/todo_list', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Todo.deleteMany({});
    for (let j = 0; j < 10; j++) {

        for (let i = 0; i < 10; i++) {

            const todos = new Todo({
                todo: `Task: ${i}`,
                time: `0${j}:0${i}`,
                email_: 'kartikgupta7267@gmail.com'
            })
            console.log(todos)
            await todos.save();
        }
    }

    for (let j = 10; j < 24; j++) {

        for (let i = 10; i < 60; i++) {

            const todos = new Todo({
                todo: `Task: ${i}`,
                time: `${j}:${i}`,
                email_: 'newcampus33@gmail.com'
            })
            await todos.save();
        }

    }
}

seedDB().then(() => {
    mongoose.connection.close();
})