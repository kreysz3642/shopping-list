const data = require('../models/pagesInfo/mainPage')
const User = require('../models/Schemas/user').User
const myError = require('../errors/error')


module.exports = {


    get: function(req, resp){
        
        User.findOne({_id : req.session.user}, (err, user)=>{
            if(user){
                data.isUserLogin = true;
                data.isMain = false
                data.userName = req.session.userName
            }else{
                req.session.user = null
                data.isMain = true
                data.isUserLogin = false
            }
            resp.render('mainPage', data)
        })
    },

    login: (req, resp, err) => {

        if(req.body.userName == ""){
            return resp.send(myError("Введите логин!"))
        }

        User.findOne({
            username: req.body.userName
        }, (err, user) => {
            if (err) return resp.send(myError('ошибка сервера, попробуйте позже'))
            if (user) {
                if(user.checkPassword(req.body.userPassword)){
                    req.session.user = user._id
                    req.session.groupId = ""
                    req.session.userName = req.body.userName
                    data.isUserLogin = true;
                    data.isMain = false;
                }else{
                    req.session.user = null;
                    return resp.json(myError("Неверный пароль"))
                }
            } else {
                req.session.user = null
                return resp.json(myError("Такого пользователя не существует"))
            }

            resp.send('')
        })
    }
}