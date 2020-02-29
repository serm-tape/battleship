import GameState from '../model/GameState'

class GameRepository {
  constructor() {
    this.gameState = []
  }

  saveState(state) {
    this.gameState.push(state)
    return this.gameState.length
  }

  getState(boardId){
    return this.gameState[boardId-1]
  }
}

export default GameRepository
