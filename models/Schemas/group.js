const mongoose = require('../../lib/mongoose')
const Schema = mongoose.Schema

let groupShema = new Schema({


    groupName: {
        type: String,
        required: true
    },


    groupDescription: {
        type: String,
        default: ""
    },


    creatorId: {
        type: String,
        required: true
    },

    creatorUserName: {
        type: String,
        required: true
    },

    listsId: [{
        id: String
    }]

})




exports.Group = mongoose.model('Group', groupShema)