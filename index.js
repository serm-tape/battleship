import express from 'express'
import http from 'http'
import api from './route/api'

const app = new express()

//routes
app.get('/', (req, res) => res.json({alive: true}))
app.use('/api', api)
let httpServer = http.createServer(app)
httpServer.listen(
    3000,
    '0.0.0.0',
    () => console.log(`http listen on port 3000`)
)

