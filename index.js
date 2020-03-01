import express from 'express'
import http from 'http'
import ApiError from './error/ApiError'
import RequestValidationError from './error/RequestValidationError'

import BattleShipApi from './route/BattleShipApi'
import GameController from './controller/GameController'
import GameService from './service/GameService'
import GameRepository, {GameRepositoryMemory} from './repository/GameRepository'
import * as CLASSIC_RULE from './rule/ClassicRule'
//import * as RUSH_RULE from './rule/RushRule'

import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost/battleship', {useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => console.log('mongo connected'))

const app = new express()

//routes
app.get('/', (req, res) => res.json({alive: true}))
//di
const gameRepo = new GameRepository(db)
const gameService = new GameService(gameRepo, CLASSIC_RULE)
const gameController = new GameController(gameService)
const battleShipApi = new BattleShipApi(gameController)

app.use('/api', battleShipApi.api)

//exception midddleware
app.use((err, req, res, next) => {
  console.log(err)
  if(err instanceof ApiError){
    res.status(err.httpStatusCode).json({error_code: err.errorCode, message: err.message})
  }else if(err instanceof RequestValidationError){
    res.status(400).json({message: err.message, details: err.details})
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

