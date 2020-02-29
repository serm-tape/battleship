import GameState from '../model/GameState'
import ApiError from '../error/ApiError'
import * as ERR from '../error/ErrorCode'
import * as constant from '../model/constant'
import * as CellState from '../model/CellState'
import Position from '../model/Position'

class GameService {
  constructor(repo) {
    this.repo = repo
  }

  place(board, ship, position, arrangement) {
    const state = this.repo.getState(board)
    if(!state) {
      throw new ApiError(ERR.NO_BOARD, 400, 'invalid board')
    }
    //check if placable
    if(state.state !== 100){
      throw new ApiError(ERR.ACTION_NOT_ALLOWED, 400, 'Couldn\'t place ship in this state')
    }
    //check if ship available
    if(state.shipPlaced[ship-1][0] >= state.shipPlaced[ship-1][1]){
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

      //Check all placed
      const ready = state.shipPlaced.reduce( (p,c) => p || c[0] === c[1], false)
    }
    state.shipPlaced[ship-1][0]++
    this.repo.saveState(board, state)
    return {ship_placed: state.shipPlaced, ready: ready}
  }

  newGame() {
    const state = new GameState()
    const id = this.repo.insertState(state)
    return id
  }
}

export default GameService