const data = require('../models/pagesInfo/registerPage')

const User = require('../models/Schemas/user').User
const validation = require('../lib/validation')
const myError = require('../errors/error')

module.exports = {
    get : (req, resp, next)=>{
        resp.status(302).render('registrationPage', data)
    
    },

    registerNewUser : (req, resp, err)=>{ 
        if(req.body.userName == "" || req.body.userPassword == "" || req.body.userPasswordRepeat == ""){
            return resp.send(myError("Все поля должны быть заполнены!"))
        }

        if(req.body.userPassword != req.body.userPasswordRepeat) {
            return resp.send(myError("Пароли не совпадают!"))
        }
        User.findOne({
            username: req.body.userName
        }, (err, user)=>{
            if (err) return resp.send(myError('ошибка сервера, попробуйте позже'))
            if(user){
                resp.send(myError("Пользователь с таким логином уже существует!"))
            }else{
                let newUser = new User({
                    username : req.body.userName,
                    password : req.body.userPassword
                })

                newUser.save((err) =>{
                    if (err) return resp.send(myError('ошибка сервера, попробуйте позже'))
                })
                resp.send('')
            }
        })
    }, 
}