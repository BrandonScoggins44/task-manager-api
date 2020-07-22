const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT      // PORT is provided by heroku when deployed

// register middleware (express authentication)
// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled')
//     } else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Site is down for maintenance')
// })

app.use(express.json()) // This defaults the request to JSON

app.use(userRouter)
app.use(taskRouter)

// Use express middleware to handle authentication
//
// Without middleware: new request -> run route handler
//
// With middleware: new request -> do something -> run route handler

app.listen(port, () => {
    console.log('Server is up on port: ', + port)
})

// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//     // const task = await Task.findById('5f13d2e319a47f6754a1e2a1')
//     // await task.populate('owner').execPopulate()     // mongoose functionality to populate user info related to the task
//     // console.log(task.owner)

//     const user = await User.findById('5f13d21963098a6ffcbcefb6')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()