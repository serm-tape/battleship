import AttackRequestSchema from '../schema/AttackRequestSchema'
import PlaceShipRequestSchema from '../schema/PlaceShipRequestSchema'
import RequestValidationError from '../error/RequestValidationError'

class GameController {
  constructor(gameService) {
    this.service = gameService
  }

  async place(req, res){
    const valid = PlaceShipRequestSchema.validate(req.body)
    if (valid.error) {
      throw new RequestValidationError(valid.error)
    }
    const {board, ship, position, arrangement} = valid.value
    const placed = await this.service.place(board, ship, position, arrangement)
    res.json(placed)
  }

  async attack(req, res){
    const valid = AttackRequestSchema.validate(req.body)
    if (valid.error) {
      throw new RequestValidationError(valid.error)
    }
    const {board, position} = valid.value
    const result = await this.service.attack(board, position)
    res.json(result)
  }

  async newGame(req, res){
    const id = await this.service.newGame()
    res.json({id: id})
  }

  async getState(req, res){
    const state = await this.service.getState(req.params.boardId)
    res.json(state)
  }
}

export default GameController
