import GameState from '../model/GameState'

class GameRepository {
  constructor() {
    this.gameState = []
  }

  insertState(state) {
    this.gameState.push(state)
    return this.gameState.length
  }

  saveState(id, state) {
    return id
  }

  getState(boardId){
    return this.gameState[boardId-1]
  }
}

export default GameRepository
