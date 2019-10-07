const data = require('../models/pagesInfo/groupsPage')
const Group = require('../models/Schemas/group').Group
const User = require('../models/Schemas/user').User
const groupListsData = require('../models/pagesInfo/groupListsPage')
const Invite = require('../models/Schemas/invite').invite
const error = require('../errors/error')


module.exports = {

    getMyGroupsPage: (req, resp) => {
        data.userName = req.session.userName
        resp.render('myGroupsPage', data)
    },


    //получить список групп
    reciveGroups: (req, resp) => {
        User.findById(req.session.user, (err, user) => {
            if (err) resp.send(myError('ошибка сервера, попробуйте позже'))
            if (user) {
                Group.find({
                    '_id': {
                        $in: user.userGroups
                    }
                }, (err, groups) => {
                    if (err) resp.send(myError('ошибка сервера, попробуйте позже'))
                    resp.send(groups)
                })
            }
        })
    },

    reciveInvites: (req, resp) => {
        User.findById(req.session.user, (err, user) => {
            Invite.find({
                invitedUser: user.username
            }, (err, invites) => {
                resp.send(invites)
            })
        })
    },

    rejectInvite : (req, resp) =>{
        if (!req.query._id) {
            return resp.send(error('Выберите заявку!'))
        }

        Invite.findByIdAndRemove(req.query._id, (err)=>{
            if(err) resp.send(error('ошибка сервера, попробуйте позже'))
            resp.send()
        })
    },

    //принять приглашение
    acceptInvite: (req, resp) => {
        if (!req.query._id) {
            return resp.send(error('Выберите заявку!'))
        }

        Invite.findById(req.query._id, (err, invite) => {
            if (!err) {
                User.findById(req.session.user, (err, user) => {
                    let groupId
                    if (!err) {
                        groupId = invite.groupId
                        user.userGroups.push(invite.groupId)
                        user.save((err) => {
                            if (err) {
                                resp.send(error('ошибка сервера, попробуйте позже'))
                                return;
                            }
                        })
                    } else {
                        resp.send(error('ошибка сервера, попробуйте позже'))
                        return;
                    }
                    Invite.deleteOne({
                        _id: req.query._id
                    }, (err) => {
                        if (err) resp.send(error('ошибка сервера, попробуйте позже'))
                        return;
                    })
                    resp.send(groupId)

                })
            } else {
                return resp.send(error('ошибка сервера, попробуйте позже'))
            }
        })

    },

    getGroupInfo: (req, resp) => {
        Group.findById(req.query.groupId, (err, group) => {
            if (!err) {
                resp.send(group)
            } else {
                resp.send(error('ошибка сервера, попробуйте позже'))
            }
        })
    },

    //добавить группу
    addGroup: (req, resp) => {
        if (req.body.groupName == "") {
            return resp.send(error('Введите название группы!'))
        }
        if (req.body) {
            User.findOne({
                _id: req.session.user
            }, (err, user) => {
                if (err) return resp.send(error('ошибка сервера, попробуйте позже'))
                if (user) {
                    let group = new Group({
                        groupName: req.body.groupName,
                        groupDescription: req.body.groupDescription,
                        creatorId: user._id,
                        creatorUserName: user.username
                    })
                    group.save((err, list) => {
                        if (err) return resp.send(error('ошибка сервера, попробуйте позже'))
                        user.userGroups.push(list._id)

                        user.save((err) => {
                            if (err) return resp.send(error('ошибка сервера, попробуйте позже'))
                            resp.send({
                                id: list._id,
                                user: user.username
                            })
                        })
                    })
                } else {
                    return resp.send(error('ошибка сервера, попробуйте позже'))
                }
            })
        }
    },

    setGroupLists: (req, resp) => {
        Group.findById({
            _id: req.query.id
        }, (err, group) => {

            groupListsData.isCreator = true;
            req.session.groupId = group._id
            resp.send('ok')

        })
    },

    groupListsPage: (req, resp) => {
        groupListsData.userName = req.session.userName
        resp.render('groupListsPage', groupListsData)

    }


}