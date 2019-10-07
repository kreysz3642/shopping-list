
module.exports = (req, res, next)=>{
    if(!req.session.user){
        return next(404)
    }else{
        next()
    }
}