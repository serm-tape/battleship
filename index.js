import express from 'express'
import http from 'http'
import ApiError from './error/ApiError'

import BattleShipApi from './route/BattleShipApi'
import GameController from './controller/GameController'
import GameService from './service/GameService'
import GameRepository from './repository/GameRepository'
import * as CLASSIC_RULE from './rule/ClassicRule'

const app = new express()

//routes
app.get('/', (req, res) => res.json({alive: true}))

//di
const gameRepo = new GameRepository()
const gameService = new GameService(gameRepo, CLASSIC_RULE)
const gameController = new GameController(gameService)
const battleShipApi = new BattleShipApi(gameController)

app.use('/api', battleShipApi.api)

//exception midddleware
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

