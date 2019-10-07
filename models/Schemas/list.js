
const mongoose = require('../../lib/mongoose')
const Schema = mongoose.Schema

let listShema = new Schema({
    listName: {
        type: String,
        required: true
    },

    groupId: Number,


    description: {
        type :String,
        default: ""
    },

    createrId: {
        type: String,
        required: true
    },

    createrName: {
        type: String
    },

    tasks: [{
        isDone: Boolean,
        text: String
    }],

    created: {
        type: Date,
        default: Date.now
    }
})




exports.list = mongoose.model('list', listShema)