const exphbs = require('express-handlebars')
const session = require('express-session')
const nconf = require('./config/configset')
const cookie = require('cookie-parser')


setViewHbs = (app) => {
    const hbs = exphbs.create({
        defaultLayout: 'main',
        extname: 'hbs'
    })
    app.engine('hbs', hbs.engine)
    app.set('view engine', 'hbs')
}

setCookiesAndSessions = (app, mongoose) => {

    let MongoStore = require('connect-mongo')(session)

    app.use(nconf.get('session: secret'))
    app.use(session({
        key: nconf.get('session:key'),
        cookie: nconf.get('session:cookie'),
        secret: nconf.get('session: secret'),
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    }))
}

module.exports = {
    setViewHbs: setViewHbs,
    setCookiesAndSessions : setCookiesAndSessions
}