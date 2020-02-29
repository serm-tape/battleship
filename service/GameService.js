import GameState from '../model/GameState'

class GameService {
  constructor(repo) {
    this.repo = repo
  }

  place(board, ship, position) {
    const state = this.repo.getState(board)
    //check if in board

    //check if overlap
    
  }

  newGame() {
    const state = new GameState()
    const id = this.repo.saveState(state)
    return id
  }
}

export default GameService