
class GameController {
  constructor(gameService) {
    this.service = gameService
  }

  place(req, res){
    const {board, ship, position, arrangement} = req.body
    const placed = this.service.place(board, ship, position, arrangement)
    res.json(placed)
  }

  attack(req, res){
    const {board, position} = req.body
    const result = this.service.attack(board, position)
    res.json(result)
  }

  newGame(req, res){
    const id = this.service.newGame()
    res.json({id: id})
  }

  getState(req, res){
    const state = this.service.getState(req.params.boardId)
    res.json(state)
  }
}

export default GameController
