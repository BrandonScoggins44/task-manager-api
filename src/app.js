const express = require('express')
const hbs = require('hbs')
const path = require('path')
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

// Establish directories for HBS to use
const publicDirectory = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

const app = express()
app.use(express.json()) // This defaults the request to JSON

// Setup HBS with express
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
app.use(express.static(publicDirectory))

app.use(userRouter)
app.use(taskRouter)

// setup home page for hbs
app.get('', (req, res) => {
    res.render('index', {
        title: 'Task App',
        name: 'Brandon - WIP'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404 Not Found',
        name: 'Brandon -WIP'
    })
})

module.exports = app