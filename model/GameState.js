import * as constant from './constant'
import * as GameStateId from './GameStateId'

class GameState {
  constructor(rule) {
    if(!rule) return
    this.hp = rule.BATTLE_SHIP_SIZE * rule.BATTLE_SHIP_COUNT + 
      rule.DESTROYER_SIZE * rule.DESTROYER_COUNT +
      rule.CRUISER_SIZE * rule.CRUISER_COUNT +
      rule.SUBMARINE_SIZE * rule.SUBMARINE_COUNT
    this.board = new Array(rule.BOARD_SIZE)
    this.shipPlaced = [
      new LimitCount(rule.BATTLE_SHIP_COUNT, 0),
      new LimitCount(rule.DESTROYER_COUNT, 0),
      new LimitCount(rule.CRUISER_COUNT, 0),
      new LimitCount(rule.SUBMARINE_COUNT, 0)
    ]
    this.shipSize = [
      rule.BATTLE_SHIP_SIZE,
      rule.CRUISER_SIZE,
      rule.DESTROYER_SIZE,
      rule.SUBMARINE_SIZE
    ]
    this.turn = 0
    this.state = GameStateId.PLACING
    for(let i = 0; i<rule.BOARD_SIZE; i++){
      this.board[i] = new Array(rule.BOARD_SIZE).fill(null)
    }
  }
}

class LimitCount {
  constructor(limit, count=0){
    this.count = count
    this.limit = limit
  }
}

export default GameState
export { LimitCount }
