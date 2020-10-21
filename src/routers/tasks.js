const express = require('express')
const { update } = require('../models/task')
const Task = require("../models/task")
const auth = require("../middleware/Auth")

const router = new express.Router()


router.post('/tasks', auth, async(req, res) => {

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send()
    }
})


router.get('/tasks', auth, async(req, res) => {


    const match = {}
    const sort = {}
    if (req.query.completed) {

        match.completed = req.query.completed === 'true'

    }


    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    console.log(sort)

    try {
        //  const tasks = await Task.find({ owner: req.user._id })
        await req.user.populate('tasks').execPopulate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort


            },

        })
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }

})


router.get('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id
    try {

        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }

})


router.patch('/tasks/:id', async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ["description", "completed"]

    const isValid = updates.every((update) => {
        return allowedUpdate.includes(update)
    })

    if (!isValid) {
        return res.status(400).send({ error: "Invalid operator" })
    }
    try {

        const task = await Task.findById(req.params.id)
        updates.forEach((update) => {

            task[update] = req.body[update]
        })

        await task.save()
            //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)


    } catch (e) {
        res.send(400).send(e)
    }


})


router.delete('/tasks/:id', auth, async(req, res) => {

    try {
        //const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(400).send()
        }

        res.send(task)

    } catch (e) {
        res.status(500).send()
    }

})

module.exports = router