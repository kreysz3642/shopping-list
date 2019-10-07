const data = require('../models/pagesInfo/personalPage')
const User = require('../models/Schemas/user').User


module.exports ={
    get: (req, resp)=>{
        User.findOne({_id : req.session.user}, (err, user)=>{
            if(user){
                data.isUserLogin = true;
                data.userName = req.session.userName
                resp.render('personalPage', data)
            }else{
                resp.send('')
            }
        })
        
    },

    logOff : (req, resp)=>{
        req.session.destroy()
        resp.redirect('/')
    },

   
}