const data = require('../models/pagesInfo/groupListsPage')
const Group = require('../models/Schemas/group').Group
const List = require('../models/Schemas/list').list
const User = require('../models/Schemas/user').User
const Invite = require('../models/Schemas/invite').invite
const myError = require('../errors/error')
const validation = require('../lib/validation')

module.exports = {

    //отправить списоки покупок
    getGroupLists: (req, resp) => {
        Group.findById(req.session.groupId, (err, group) => {
            if(err) return resp.send('ошибка сервера, попробуйте позже')
            if (group) {
                List.find({
                    '_id': {
                        $in: group.listsId
                    }
                }, (err, lists) => {
                    if(err) return resp.send('ошибка сервера, попробуйте позже')
                    let listsToSend = []
                    for (let i = 0; lists.length > i; i++) {
                        let listData = {
                            id: lists[i]._id,
                            listName: lists[i].listName,
                            description: lists[i].description,
                            username: lists[i].createrName
                        }
                        listsToSend.push(listData)
                    }
                    resp.send(listsToSend)

                })
            }
        })
    },



    //отправить список пользователей
    getUsers: (req, resp) => {
        User.find({
            userGroups: {
                _id: req.session.groupId
            }
        }, (err, users) => {
            if (!err) {
                let usersNames = []
                for (let i = 0; users.length > i; i++) {
                    usersNames.push(users[i].username)
                }
                resp.send(usersNames)
            } else {
                resp.send(myError('ошибка сервера, попробуйте позже'))
            }
        })
    },


    //добавить список покупок
    addNewListInGroup: (req, resp) => {

        if(req.body.listName == ""){
            return resp.send(myError("Введите название списка!"))
        }
        Group.findById(req.session.groupId, (err, group) => {
            if(err) resp.send(myError('ошибка сервера, попробуйте позже'))
            User.findById(req.session.user, (err, user) => {
                if(err) resp.send(myError('ошибка сервера, попробуйте позже'))
                let list = new List({
                    listName: req.body.listName,
                    description: req.body.description,
                    createrId: user._id,
                    createrName: user.username
                })


                list.save((err, list) => {
                    if(err) resp.send(myError('ошибка сервера, попробуйте позже'))
                    group.listsId.push(list._id)
                    group.save((err) => {
                        if(err) resp.send(myError('ошибка сервера, попробуйте позже'))
                    })
                    resp.send({
                        id: list._id,
                        user: list.createrName
                    })
                })
            })
        })
    },

    deleteList : (req, resp) =>{
        Group.findById(req.session.groupId, (err, group) =>{
            let posList = -1;
            if (err) return resp.send(myError('ошибка сервера, попробуйте позже'))
            for(let i = 0; group.listsId.length > i; i++){
                if(group.listsId[i]._id == req.query.id){
                    posList = i;
                    break;
                }
            }
            if(posList == -1) return resp.send(myError('ошибка сервера, попробуйте позже'))
            if(posList || posList == 0){
                group.listsId.splice(posList, 1)
            }else{
                return resp.send(myError('ошибка сервера, попробуйте позже'))
            }

            group.save((err)=>{
                if (err) return resp.send(myError('ошибка сервера, попробуйте позже'))
                List.findByIdAndRemove(req.query.id, (err)=>{
                    if (err) return resp.send(myError('ошибка сервера, попробуйте позже'))
                    resp.send()
                })
            })
        })
    },


    //пригласить пользователя в группу
    inviteNewPerson: (req, resp, next) => {
        if(req.query.invitedUser == ""){
            return resp.send(myError("Введите имя пользователя!"))
        }




        User.findOne({
            username: req.query.invitedUser
        }, (err, user) => {
            if (!err) {
                if (user === null) {
                    resp.send(myError("Данного пользователя не существует!"))
                    return
                }
            } else {
                resp.send(myError('ошибка сервера, попробуйте позже'))
                return 
            }

            for(let i = 0; user.userGroups.length > i; i++){
                if(user.userGroups[i]._id == req.session.groupId){
                    resp.send(myError("Пользователь уже состоит в этой группе!"))
                    return
                }
            }

            Group.findById(req.session.groupId, (err, group) => {
                let invite;
                if (!err) {
                    invite = new Invite({
                        groupId: req.session.groupId,
                        invitedUser: req.query.invitedUser,
                        senderUser: req.session.user,
                        groupName: group.groupName
                    })
    
                } else {
                    return resp.send(myError('ошибка сервера, попробуйте позже'))
                }

                Invite.findOne({groupId : req.session.groupId, invitedUser: req.query.invitedUser}, (err, inv)=>{
                    if(inv != null){
                        return resp.send(myError('Запрос уже создан!'))
                    }

                    invite.save((err) => {
                        if (err) return resp.send(myError('ошибка сервера, попробуйте позже'))
                    })
                    resp.send("Приглашение отправлено")
                    
                })
    
            })
        
        })
    }
}