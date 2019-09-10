const express = require('express')
const routes = require('./routes')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

// bad practice => server must be stateless. solution is to use key-value database
const connectedUsers = {

}

io.on('connection', socket => {
    const { user } = socket.handshake.query
    
    connectedUsers[user] = socket.id
})

mongoose.connect(
    'mongodb://root:password@localhost/admin',
    {
        useNewUrlParser: true,
        dbName: 'tindev'
    }
)

app.use((req, res, next) => {
    req.io = io
    req.connectedUsers = connectedUsers

    return next()
})

app.use(cors())
app.use(express.json())
app.use(routes)

server.listen(3333)