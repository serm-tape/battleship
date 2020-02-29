
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
    
  }

  newGame(req, res){
    const id = this.service.newGame()
    res.json({id: id})
  }
}

export default GameController
