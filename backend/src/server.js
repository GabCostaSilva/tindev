const express = require('express')
const routes = require('./routes')
const mongoose = require('mongoose')

const server = express()

mongoose.connect(
    'mongodb://root:password@localhost/admin',
    {
        useNewUrlParser: true, 
    }
)
server.use(express.json())

server.use(routes)

server.listen(3333)