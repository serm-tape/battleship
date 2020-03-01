import * as constant from './constant'
import * as GameStateId from './GameStateId'

class GameState {
  constructor(rule) {
    this.hp = rule.BATTLE_SHIP_SIZE * rule.BATTLE_SHIP_COUNT + 
      rule.DESTROYER_SIZE * rule.DESTROYER_COUNT +
      rule.CRUISER_SIZE * rule.CRUISER_COUNT +
      rule.SUBMARINE_SIZE * rule.SUBMARINE_COUNT
    this.board = new Array(rule.BOARD_SIZE)
    this.shipPlaced = [
      [0, rule.BATTLE_SHIP_COUNT],
      [0, rule.DESTROYER_COUNT],
      [0, rule.CRUISER_COUNT],
      [0, rule.SUBMARINE_COUNT]
    ]
    this.shipSize = [
      rule.BATTLE_SHIP_SIZE,
      rule.CRUISER_SIZE,
      rule.DESTROYER_SIZE,
      rule.SUBMARINE_SIZE
    ]
    this.turn = 0
    this.state = GameStateId.PLACING
    this.result = null
    for(let i = 0; i<rule.BOARD_SIZE; i++){
      this.board[i] = new Array(10).fill(null)
    }
  }
}

export default GameState
