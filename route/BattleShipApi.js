import express from 'express'
import bodyParser from 'body-parser'

class BattleShipApi{
  constructor(battleShipController) {
    this.controller = battleShipController

    this.api = new express.Router()
    this.api.use(bodyParser.json())

    this.api.post('/newgame', (req, res) => this.controller.newGame(req, res))
    this.api.post('/place', (req, res) => this.controller.place(req, res))
    this.api.post('/attack', (req, res) => this.controller.attack(req, res))
    this.api.get('/state/:boardId', (req, res) => this.controller.getState(req, res))
  }
}

export default BattleShipApi
