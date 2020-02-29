import * as constant from './constant'

class GameState {
  constructor() {
    this.hp = constant.BATTLE_SHIP_SIZE * constant.BATTLE_SHIP_COUNT + 
      constant.DESTROYER_SIZE * constant.DESTROYER_COUNT +
      constant.CRUISER_SIZE * constant.CRUISER_COUNT +
      constant.SUBMARINE_SIZE * constant.SUBMARINE_COUNT
    this.board = new Array(constant.BOARD_SIZE)
    this.shipPlaced = [
      [0, constant.BATTLE_SHIP_COUNT],
      [0, constant.DESTROYER_COUNT],
      [0, constant.CRUISER_COUNT],
      [0, constant.SUBMARINE_COUNT]
    ]
    this.shipSize = [
      constant.BATTLE_SHIP_SIZE,
      constant.CRUISER_SIZE,
      constant.DESTROYER_SIZE,
      constant.SUBMARINE_SIZE
    ]
    this.turn = 0
    this.state = 100
    this.result = null
    for(let i = 0; i<constant.BOARD_SIZE; i++){
      this.board[i] = new Array(10).fill(null)
    }
  }
}

export default GameState
