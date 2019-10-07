const mongoose = require('../../lib/mongoose')
const Schema = mongoose.Schema

let invite = new Schema({


    groupId: {
        type: String,
        required: true
    },

    invitedUser:{
        type: String, 
        required: true
    }, 

    senderUser: {
        type: String, 
        required: true
    },

    groupName: {
        type: String,
        required: true
    }
})




exports.invite = mongoose.model('invite', invite)