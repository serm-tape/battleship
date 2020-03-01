import GameState from '../model/GameState'
import ApiError from '../error/ApiError'
import * as ERR from '../error/ErrorCode'
import * as constant from '../model/constant'
import * as CellState from '../model/CellState'
import Position from '../model/Position'
import * as GameStateId from '../model/GameStateId'

class GameService {
  constructor(repo, rule) {
    this.repo = repo
    this.rule = rule
  }

  async place(board, ship, position, arrangement) {
    const state = await this.repo.getState(board)
    if(!state) {
      throw new ApiError(ERR.NO_BOARD, 400, 'invalid board')
    }
    //check if placable
    if(state.state !== GameStateId.PLACING){
      throw new ApiError(ERR.ACTION_NOT_ALLOWED, 400, 'Couldn\'t place ship in this state')
    }
    //check if ship available
    if(state.shipPlaced[ship-1].count >= state.shipPlaced[ship-1].limit){
      throw new ApiError(ERR.NO_SHIP, 400, `Couldn't place more ship type of ${ship}`)
    }

    //getSize
    let xSize = 1
    let ySize = 1
    if(arrangement === constant.VERTICAL){
      ySize = state.shipSize[ship-1]
    }
    if(arrangement === constant.HORIZONTAL){
      xSize = state.shipSize[ship-1]
    }

    //check if in board
    if(position.x + xSize > state.board.length || 
      position.x < 0 ||
      position.y + ySize > state.board[position.x].length ||
      position.y < 0
    ){
      throw new ApiError(ERR.SHIP_EXCEED_BOARD_SIZE, 400, 'Ship doesn\'t fit in board')
    }

    //check if overlap and place it
    for(let i = 0; i < state.shipSize[ship-1]; i++){
      const fillX = arrangement===constant.VERTICAL?0:i
      const fillY = arrangement===constant.VERTICAL?i:0
      const fpos = new Position(position.x + fillX, position.y + fillY)
      if(state.board[fpos.x][fpos.y] === CellState.BARRIER){
        throw new ApiError(ERR.SHIP_OVERLAP, 400, `Ship too close with others (${fpos.x}, ${fpos.y})`)
      }
      if(state.board[fpos.x][fpos.y] !== null){
        throw new ApiError(ERR.SHIP_OVERLAP, 400, `Ship overlap at (${fpos.x}, ${fpos.y})`)
      }
      state.board[fpos.x][fpos.y] = CellState.OCCUPIED

      //add barrier
      if (arrangement === constant.HORIZONTAL){
        //side
        if(fpos.y > 0)
          state.board[fpos.x][fpos.y - 1] = CellState.BARRIER
        if(fpos.y < state.board[fpos.x].length - 1)
          state.board[fpos.x][fpos.y + 1] = CellState.BARRIER
        //head
        if(i===0 && fpos.x > 0)
          state.board[fpos.x - 1][fpos.y] = CellState.BARRIER
        //tail
        if(i===state.shipSize[ship-1] - 1 && fpos.x < state.board.length - 1)
          state.board[fpos.x + 1][fpos.y] = CellState.BARRIER
      }
      if (arrangement === constant.VERTICAL){
        //side
        if(fpos.x > 0)
          state.board[fpos.x - 1][fpos.y] = CellState.BARRIER
        if(fpos.x < state.board.length - 1)
          state.board[fpos.x + 1][fpos.y] = CellState.BARRIER
        if(i===0 && fpos.y > 0)
          state.board[fpos.x][fpos.y - 1] = CellState.BARRIER
        if(i===state.shipSize[ship-1] - 1 && fpos.y < state.board[fpos.x].length - 1)
          state.board[fpos.x][fpos.y + 1] = CellState.BARRIER
      }
    }
    state.shipPlaced[ship-1].count++
    //Check all placed
    const ready = state.shipPlaced.reduce( (p,c) => p && c.count === c.limit, true)
    if (ready) {
      state.state = GameStateId.PLAYING
    }
    await this.repo.saveState(board, state)
    return {ship_placed: state.shipPlaced, ready: ready}
  }

  async newGame() {
    const state = new GameState(this.rule)
    const id = await this.repo.insertState(state)
    return id
  }

  async attack(board, position){
    const state = await this.repo.getState(board)

    //state found
    if(!state) {
      throw new ApiError(ERR.NO_BOARD, 400, 'invalid board')
    }
    //check state
    if (state.state !== GameStateId.PLAYING) {
      throw new ApiError(ERR.ACTION_NOT_ALLOWED, 400, 'Couldn\'t attack in this state')
    }

    //fired in board
    if (position.x >= state.board.length || position.x < 0 ||
      position.y >= state.board[position.x].length || position.y < 0 
    ) {
      throw new ApiError(ERR.ATTACK_POSITION_EXCEED_BOARD_SIZE, 400, 'Attack position not in board')
    }

    //check fired
    const cell = state.board[position.x][position.y]
    if (cell === CellState.FIRED_HIT || cell === CellState.FIRED_MISS) {
      throw new ApiError(
        ERR.ALREDY_ATTACKED,
        400,
        `This cell already attacked (${position.x}, ${position.y}) and ${cell === CellState.FIRED_HIT?'HIT':'MISS'}`
      )
    }

    let isHit = false
    if (cell === CellState.OCCUPIED) {
      isHit = true
      state.hp -= 1
      state.board[position.x][position.y] = CellState.FIRED_HIT
    } else {
      state.board[position.x][position.y] = CellState.FIRED_MISS
    }
    state.turn += 1

    if (state.hp === 0){
      state.state = GameStateId.END
    }

    await this.repo.saveState(board, state)

    return {hit: isHit, cell_left: state.hp, turn: state.turn, win: state.state === GameStateId.END}
  }

  async getState(board){
    const state = await this.repo.getState(board)

    //state found
    if(!state) {
      throw new ApiError(ERR.NO_BOARD, 400, 'invalid board')
    }
    const attackerView = state.board.map( col => 
      col.map( cell => {
        if(cell === null) return null
        else if(cell === CellState.FIRED_HIT) return true
        else if(cell === CellState.FIRED_MISS) return false
      })
    )

    return {turn: state.turn, cell_left: state.hp, board: attackerView, state: state.state}
  }
}

export default GameService
