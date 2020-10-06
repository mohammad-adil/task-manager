require("../src/db/mongoose")

const { findByIdAndRemove } = require("../src/models/task")
const Task = require("../src/models/task")




// Task.findByIdAndRemove('5f7c144220018724d0cf39c2').then((result) => {

//     console.log(result)
//     return Task.countDocuments({ completed: false })

// }).then((task) => {

//     console.log(task)

// }).catch((e) => {
//     console.log(e)
// })


const findOneAndRemove = async(id, status) => {

    const task = await Task.findByIdAndRemove(id)
    const count = await Task.countDocuments({ completed: status })

    return task
}


findOneAndRemove('5f7c20e854b1bd046480b229', true).then((task) => {
    console.log(task)
}).catch((e) => {
    console.log(e)
})