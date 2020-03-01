import GameState from '../model/GameState'
import GameStateSchema from '../model/schema/GameStateSchema'
import mongoose from 'mongoose'

class GameRepositoryMemory {
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

class GameRepository {
  constructor(db){
    this.stateModel = mongoose.model('game_state', GameStateSchema)
  }

  async insertState(state) {
    const model = new this.stateModel({
      hp: state.hp,
      board: state.board,
      ship_size: state.shipSize,
      ship_placed: state.shipPlaced,
      turn: state.turn,
      state: state.state,
    })
    const result = await model.save()
    console.log(`create new game id: ${result._id}`)
    return result._id
  }

  async saveState(id, state) {
    await this.stateModel.update({_id: id}, {
      hp: state.hp,
      board: state.board,
      ship_size: state.shipSize,
      ship_placed: state.shipPlaced,
      turn: state.turn,
      state: state.state,
    })
    console.log(`saved game state id: ${id}`)
  }

  async getState(id){
    const state = await this.stateModel.findById(id)
    if(!state) return null
    const result = new GameState()
    result.hp = state.hp
    result.board = state.board
    result.shipSize = state.ship_size
    result.shipPlaced = state.ship_placed
    result.turn = state.turn
    result.state = state.state
    return result
  }
}

export default GameRepository
export { GameRepositoryMemory }
