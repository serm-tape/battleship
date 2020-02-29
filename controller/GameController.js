
class GameController {
  constructor(gameService) {
    this.service = gameService
  }

  place(req, res){
    const {body} = req
    let board
    if(!body.board){
      res.status(400, {message: 'No board found'})
    }
    //const board = getBoard(body.board)
    //save database (body.type, body.position)
  }

  attack(req, res){
    this.service.newGame()
  }

  newGame(req, res){
    const id = this.service.newGame()
    res.json({id: id})
  }
}

export default GameController
