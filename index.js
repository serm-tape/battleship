import express from 'express'
import http from 'http'
import api from './route/api'
import ApiError from './error/ApiError'

const app = new express()

//routes
app.get('/', (req, res) => res.json({alive: true}))
app.use('/api', api)
app.use((err, req, res, next) => {
  console.log(err)
  if(err instanceof ApiError){
    res.status(err.httpStatusCode).json({error_code: err.errorCode, message: err.message})
  }else{
    res.status(500).json({message: 'unexpected error'})
  }
})

let httpServer = http.createServer(app)
httpServer.listen(
    3000,
    '0.0.0.0',
    () => console.log(`http listen on port 3000`)
)

