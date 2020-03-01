import express from 'express'
import bodyParser from 'body-parser'

class BattleShipApi{
  constructor(battleShipController) {
    this.controller = battleShipController

    this.api = new express.Router()
    this.api.use(bodyParser.json())

    this.api.post('/newgame', (req, res, next) => this.asyncWrapper(this.controller.newGame(req, res), next))
    this.api.post('/place', (req, res, next) => this.asyncWrapper(this.controller.place(req, res), next))
    this.api.post('/attack', (req, res, next) => this.asyncWrapper(this.controller.attack(req, res), next))
    this.api.get('/state/:boardId', (req, res, next) => this.asyncWrapper(this.controller.getState(req, res), next))
  }

  asyncWrapper(promiseController, next) {
    promiseController.catch(next)
  }
}

export default BattleShipApi
