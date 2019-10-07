const crypto = require('crypto')

const mongoose = require('../../lib/mongoose')
const Schema = mongoose.Schema

let userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },

    hashedPassword: {
        type: String,
        required: true
    },

    userGroups : [{
        groupId : String
    }],

    userLists : [{}],

    salt: {
        type: String,
        required: true
    },

    created: {
        type: Date,
        default: Date.now
    }
})

userSchema.method('encryptPassword', function(password){
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
})


userSchema.virtual('password')
    .set(function(password){
        this._plainPassword = password
        this.salt = Math.random() + ''
        this.hashedPassword = this.encryptPassword(password)
    })
    .get(function() {
        return this._plainPassword
    })

    userSchema.method('checkPassword', function(password){
    return this.encryptPassword(password) === this.hashedPassword
})


exports.User = mongoose.model('User', userSchema)