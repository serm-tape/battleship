import * as constant from './constant'

class GameState {
  constructor() {
    this.hp = constant.BATTLE_SHIP_SIZE * constant.BATTLE_SHIP_COUNT + 
      constant.DESTROYER_SIZE * constant.DESTROYER_COUNT +
      constant.CRUISER_SIZE * constant.CRUISER_COUNT +
      constant.SUBMARINE_SIZE * constant.SUBMARINE_COUNT
    this.board = new Array(10).fill(new Array(10).fill(null))
    this.shipPlaced = [0, 0, 0, 0]
    this.turn = 0
    this.state = 100
    this.result = null
  }
}

export default GameState
