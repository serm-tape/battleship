
class GameController {
  constructor(gameService) {
    this.service = gameService
  }

  async place(req, res){
    const {board, ship, position, arrangement} = req.body
    const placed = await this.service.place(board, ship, position, arrangement)
    res.json(placed)
  }

  async attack(req, res){
    const {board, position} = req.body
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
