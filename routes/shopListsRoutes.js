const shopListsData = require('../models/pagesInfo/shopLists')
const List = require('../models/Schemas/list').list
const User = require('../models/Schemas/user').User
const mongoose = require('../lib/mongoose')
const myError = require('../errors/error')

module.exports = {
    shopLists: (req, resp) => {
        shopListsData.userName = req.session.userName
        resp.render('shopLists', shopListsData)
    },

    //отправить список покупок при загрузке
    reciveLists: (req, resp) => {
        User.findOne({
            _id: req.session.user
        }, (err, user) => {
            if (err) return resp.send(myError('ошибка сервера, попробуйте позже'))
            List.find({
                '_id': {
                    $in: user.userLists
                }
            }, (err, lists) => {
                if (err) return resp.send(myError('ошибка сервера, попробуйте позже'))
                let masLists = []
                for (let i = 0; i < lists.length; i++) {
                    let listWithName = {
                        id: lists[i]._id,
                        listName: lists[i].listName,
                        description: lists[i].description,
                        username: user.username
                    }

                    masLists.push(listWithName)
                }
                resp.send(masLists)
            })
        })
    },

    //удалить список покупок
    deleteList : (req, resp) =>{
        User.findById(req.session.user, (err, user) =>{
            if (err) return resp.send(myError('ошибка сервера, попробуйте позже'))
            let posList = user.userLists.indexOf(req.query.id)
            if(posList || posList == 0){
                user.userLists.splice(posList, 1)
            }else{
                return resp.send(myError('ошибка сервера, попробуйте позже'))
            }

            user.save((err)=>{
                if (err) return resp.send(myError('ошибка сервера, попробуйте позже'))
                List.findByIdAndRemove(req.query.id, (err)=>{
                    if (err) return resp.send(myError('ошибка сервера, попробуйте позже'))
                    resp.send()
                })
            })
        })
    },

    //создание списка покупок
    createNewList: (req, resp) => {
        if(req.body.inputListName == "") {
            return resp.send(myError('Введите имя списка!'))
        }
        if (req.body) {
            User.findOne({
                _id: req.session.user
            }, (err, user) => {
                if (err) return resp.send(myError('ошибка сервера, попробуйте позже'))
                if (user) {
                    let list = new List({
                        listName: req.body.inputListName,
                        description: req.body.description,
                        createrId: user._id
                    })
                    list.save((err, list, affected) => {
                        if (err) return resp.send(myError('ошибка сервера, попробуйте позже'))
                        user.userLists.push(list._id)
                        user.save((err, list, affected) =>{
                            if (err) return resp.send(myError('ошибка сервера, попробуйте позже'))

                        })
                        resp.send({
                            id: list._id,
                            user: user.username
                        })
                    })
                }
            })


        }
    },


    //получтить по id список покупок
    reciveTasks: (req, resp) => {
        List.findById(req.query.id, (err, list) => {
            if (err) return resp.send(myError('ошибка сервера, попробуйте позже'))
            resp.send(list)
        })
    },

    //сохранение элементов списка
    saveTasks: (req, resp) => {
        List.findById(req.body.id, async (err, list) => {
            if (err) return resp.send(myError('ошибка сервера, попробуйте позже'))
            list.tasks = req.body.tasks
            list.save((err) => {
                if (err) {
                    return resp.send(myError('ошибка сервера, попробуйте позже'))
                } else {
                    resp.send()
                }
            })
        })
    }
}