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

    reciveGroups: (req, resp) => {
        User.findById(req.session.user, (err, user) => {
            if(err) resp.send(myError('ошибка сервера, попробуйте позже'))
            if (user) {
                Group.find({
                    '_id': {
                        $in: user.userGroups
                    }
                }, (err, groups) => {
                    if(err) resp.send(myError('ошибка сервера, попробуйте позже'))
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

    acceptInvite: (req, resp) => {
        let groupId
        Invite.findById(req.query._id, (err, invite) => {
            if (!err) {
                User.findById(req.session.user, (err, user) => {
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

                })
            } else {
                resp.send(error('ошибка сервера, попробуйте позже'))
                return;
            }
        })

        Invite.deleteOne({
            _id: req.query._id
        }, (err) => {
            if (err) resp.send(error('ошибка сервера, попробуйте позже'))
            return;
        })

        resp.send(groupId)

    },

    getGroupInfo: (req, resp) => {
        Group.findById(req.groupId, (err, group) => {
            if (!err) {
                resp.send(group)
            } else {
                resp.send(error('ошибка сервера, попробуйте позже'))
            }
        })
    },

    addGroup: (req, resp) => {
        if (req.body) {
            User.findOne({
                _id: req.session.user
            }, (err, user) => {
                if (user) {
                    let group = new Group({
                        groupName: req.body.groupName,
                        groupDescription: req.body.groupDescription,
                        creatorId: user._id,
                        creatorUserName: user.username
                    })
                    group.save((err, list, affected) => {
                        user.userGroups.push(list._id)

                        user.save((err, list, affected) => {})

                        resp.send({
                            id: list._id,
                            user: user.username
                        })
                    })
                } else {
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