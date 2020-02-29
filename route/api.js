import express from 'express'
import bodyParser from 'body-parser'

import GameController from '../controller/GameController'
import GameService from '../service/GameService'
import GameRepository from '../repository/GameRepository'

const gameRepo = new GameRepository()
const gameService = new GameService(gameRepo)
const gameController = new GameController(gameService)


const api = new express.Router()
api.use(bodyParser.json())

api.post('/newgame', (req, res) => gameController.newGame(req, res))
api.post('/place', (req, res) => gameController.place(req, res))

export default api
