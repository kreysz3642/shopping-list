const express = require('express')
const nconf = require('./config/configset')
const castApp = require('./castApp')
const routes = require('./routes/routes')
const mongoose = require('./lib/mongoose')
const session = require('express-session')



const app = express()


app.use(express.static(__dirname + '/public'))
castApp.setViewHbs(app)

mongoose.connect(nconf.get('mongoose:uri'), nconf.get('mongoose:optins'))


let MongoStore = require('connect-mongo')(session)



app.use(express.static(__dirname + '/public'))


app.use(
  session({
    secret: "fdslflsd",
    key: nconf.get('session:key'),
    cookie: nconf.get('session:cookie'),
    store: new MongoStore({
      host: '127.0.0.1',
      port: '27017',
      db: 'session',
      url: 'mongodb://localhost:27017/test'
    })
  })
);




app.use(routes)



app.listen(nconf.get('port'), () => {
  console.log(`Server start on port: ${nconf.get('port')}`)
})