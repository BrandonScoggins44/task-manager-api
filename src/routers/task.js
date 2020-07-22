const express = require('express')
const router = new express.Router()

const auth = require('../middleware/auth')
const Task = require('../models/task')
const User = require('../models/user')

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,     // es6 spread operator -> takes fields from used object and applies them to the new object
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// GET /tasks?completed=(queryParam)
// GET /task?limit=(numOfResultPerPage)
// GET /task?skip=(numOfResultsToSkip)      skip / limit = page
// GET /task?sortBy=(field)(_/:*)(asc/desc)         // split by special character
router.get('/tasks', auth, async (req, res) => {
    try {
        // ---------------------------------------------------------------------------------------------------------------------------------------------
        // const tasks = await Task.find({          // this is one way to find all task that belong to the authorized user
        //     owner: req.user._id
        // })
        // ---------------------------------------------------------------------------------------------------------------------------------------------
        // await req.user.populate('tasks').execPopulate()     // another way to do it using populate method from mongoose and virtual property
        // ---------------------------------------------------------------------------------------------------------------------------------------------
        // enhancing above code to filter tasks by 'completed'
        // ---------------------------------------------------------------------------------------------------------------------------------------------
        const match = {}
        const sort = {}

        if (req.query.completed) {
            match.completed = req.query.completed === 'true'
        }

        if (req.query.sortBy) {                                     // only allows sorting by one value - maybe it can be looped to filter by multiple fields
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1          // uses bracket notation to dynamicly set the name of the field to sortBy and uses ternary operator to dynamicly set the direction
        }

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),    // mongoose will ignore this if limit is not provided
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        // ---------------------------------------------------------------------------------------------------------------------------------------------
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    if (_id.length !== 24) {  // _id must be 24 characters. findById(_id) will throw and error otherwise so returning not found instead
        return res.status(404).send()
    }

    try {
        // const task = await Task.findById(_id)
        const task = await Task.findOne({
            _id,
            owner: req.user._id         // ensures that the task belongs to the authenticated user
        })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']

    const isValidUpdate = updates.every((property) => allowedUpdates.includes(property))

    if (!isValidUpdate) {
        return res.status(400).send({ error: 'Invalid update parameter.' })
    }

    const _id = req.params.id

    if (_id.length !== 24) {
        return res.status(404).send()
    }

    try {
        // ---------------------------------------------------------------
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])     // bracket notation. Access a property of the object by the property name

        await task.save()

        // use above code to work with middle ware (bcrypt). The .findBy_and_ methods get around middleware

        // const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        // ---------------------------------------------------------------

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    if (_id.length !== 24) {  // _id must be 24 characters. findById(_id) will throw and error otherwise so returning not found instead
        return res.status(404).send()
    }

    try {
        const task = await Task.findOneAndDelete({
            _id,
            owner: req.user._id
        })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router