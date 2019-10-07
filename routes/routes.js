const {Router} = require('express')
const router = Router()
const mainPageRoutes = require('./mainPageRoutes')
const regRoutes = require('./registerPageRoutes')
const jsonParser = require('express').json();
const perRoutes = require('./personalPageRoutes')
const shopListsRoutes = require('./shopListsRoutes')
const groupsRoutes = require('./groupsRoutes')
const groupLists = require('./groupListsRoutes')
const checkAuth = require('../middleware/checkAuth')


router.get('/logOff', perRoutes.logOff)

router.get('/personalPage/shopLists', checkAuth, shopListsRoutes.shopLists)
router.post('/personalPage/shopLists/saveTasks', jsonParser, shopListsRoutes.saveTasks)
router.get('/personalPage/shopLists/reciveTasks', shopListsRoutes.reciveTasks)
router.get('/personalPage/shopLists/reciveLists', jsonParser, shopListsRoutes.reciveLists)
router.post('/personalPage/shopLists/createNewList', jsonParser, shopListsRoutes.createNewList)
router.get('/personalPage/shopLists/deleteList', shopListsRoutes.deleteList)



router.get('/personalPage', checkAuth, jsonParser, perRoutes.get)




router.get('/personalPage/myGroups', checkAuth, groupsRoutes.getMyGroupsPage)
router.post('/personalPage/myGroups/addGroup', jsonParser, groupsRoutes.addGroup)
router.get('/personalPage/myGroups/reciveGroups', groupsRoutes.reciveGroups)
router.get('/personalPage/myGroups/setGroupLists', groupsRoutes.setGroupLists)
router.get('/personalPage/myGroups/reciveInvites', groupsRoutes.reciveInvites)
router.get('/personalPage/myGroups/acceptInvite', groupsRoutes.acceptInvite)
router.get('/personalPage/myGroups/rejectInvite', groupsRoutes.rejectInvite)
router.get('/personalPage/myGroups/getGroupInfo', groupsRoutes.getGroupInfo)
router.get('/personalPage/myGroups/groupListsPage', checkAuth, groupsRoutes.groupListsPage)


router.get('/personalPage/myGroups/groupListsPage/getGroupLists', groupLists.getGroupLists)
router.post('/personalPage/myGroups/groupListsPage/addNewListInGroup', jsonParser, groupLists.addNewListInGroup)
router.get('/personalPage/myGroups/groupListsPage/inviteNewPerson', groupLists.inviteNewPerson)
router.get('/personalPage/myGroups/groupListsPage/getUsers', groupLists.getUsers)
router.get('/personalPage/myGroups/groupListsPage/deleteList', groupLists.deleteList)

router.post('/login', jsonParser, mainPageRoutes.login)
router.get('/', mainPageRoutes.get)


router.get('/registration', regRoutes.get)
router.post('/regNewUser', jsonParser, regRoutes.registerNewUser)


module.exports = router
