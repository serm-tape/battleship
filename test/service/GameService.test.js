import GameService from '../../service/GameService'
import { GameRepositoryMemory } from '../../repository/GameRepository'
import ApiError from '../../error/ApiError'
import * as constant from '../../model/constant'
import * as GameStateId from '../../model/GameStateId'

const rule = {
  BATTLE_SHIP_COUNT: 1,
  BATTLE_SHIP_SIZE: 2,
  DESTROYER_COUNT: 1,
  DESTROYER_SIZE: 1,
  CRUISER_COUNT: 0,
  CRUISER_SIZE: 0,
  SUBMARINE_COUNT: 0,
  SUBMARINE_SIZE: 0,
  BOARD_SIZE: 3
}

describe ('test GameService', () => {
  describe ('placing', () => {
    let service
    let repo
    beforeAll( () => {
      repo = new GameRepositoryMemory()
      service = new GameService(repo, rule)
    })
    test ('Board use rule', async () => {
      const id = await service.newGame()

      const state = repo.gameState[id-1]
      expect(state.shipPlaced.length).toBe(4)
      expect(state.shipSize[0]).toBe(2)
      expect(state.shipSize[2]).toBe(1)
      expect(state.shipPlaced[0].limit).toBe(1)
      expect(state.shipPlaced[2].limit).toBe(1)
    })

    test ("Couldn't attack in placing state", async () => {
      const id = await service.newGame()
      await expect(service.attack(id, {x: 0, y: 0})).rejects.toThrow(ApiError)
    })

    test ("Couldn't place ship out side board", async () => {
      const id = await service.newGame()
      await expect(service.place(id, constant.BATTLE_SHIP, {x: 0, y:3}, constant.HORIZONTAL)).rejects.toThrow(ApiError)
      await expect(service.place(id, constant.BATTLE_SHIP, {x: 2, y:2}, constant.VERTICAL)).rejects.toThrow(ApiError)
    })

    test ("Ship couldn't be overlap", async () => {
      const id = await service.newGame()
      const pResult = await service.place(id, constant.BATTLE_SHIP, {x:0,y:0}, constant.VERTICAL)
      expect(pResult.ship_placed[constant.BATTLE_SHIP-1].count).toBe(1)

      await expect(service.place(id, constant.BATTLE_SHIP, {x:0,y:1}, constant.HORIZONTAL)).rejects.toThrow(ApiError)
      await expect(service.place(id, constant.BATTLE_SHIP, {x:1,y:1}, constant.HORIZONTAL)).rejects.toThrow(ApiError)
    })

    test ("Couldn't place ship more than limited", async () => {
      const id = await service.newGame()
      await expect(service.place(id, constant.SUBMARINE, {x:0,y:0}, constant.VERTICAL)).rejects.toThrow(ApiError)
    })

    test ("State changed when all ship placed", async () => {
      const id = await service.newGame()
      const result1 = await service.place(id, constant.BATTLE_SHIP, {x:0,y:0}, constant.VERTICAL)
      const result2 = await service.place(id, constant.DESTROYER, {x:2,y:2}, constant.VERTICAL)
      expect(result1.ready).toBe(false)
      expect(result2.ready).toBe(true)
    })

    test ("Couldn't place ship in PLAYING state", async () => {
      const id = await service.newGame()
      repo.gameState[id-1].state = GameStateId.PLAYING
      await expect(service.place(id, constant.BATTLE_SHIP, {x:0,y:0}, constant.VERTICAL)).rejects.toThrow(ApiError)
    })
  })

  describe ('Attacking', () => {
    let service
    let repo
    let placed
    let id
    beforeAll( () => {
      repo = new GameRepositoryMemory()
      service = new GameService(repo, rule)
    })
    beforeEach( async () => {
      
      placed = [
        [0, 0, 1],  //011
        [1, 1, 1],  //010
        [1, 0, 1]   //111
      ]
    })

    test ("Couldn't attack outside of the board", async () => {
      id = await service.newGame()
      repo.gameState[id-1].board = placed
      repo.gameState[id-1].state = GameStateId.PLAYING
      await expect(service.attack(id, {x:3,y:0})).rejects.toThrow(ApiError)
    })

    test ("Attack miss", async () => {
      id = await service.newGame()
      repo.gameState[id-1].board = placed
      repo.gameState[id-1].state = GameStateId.PLAYING
      const result = await service.attack(id, {x:2, y:0})
      expect(result.hit).toBe(false)
      expect(result.cell_left).toBe(3)
      expect(result.win).toBe(false)
      expect(result.turn).toBe(1)
    })

    test ('Attack hit', async () => {
      id = await service.newGame()
      repo.gameState[id-1].board = placed
      repo.gameState[id-1].state = GameStateId.PLAYING
      const result = await service.attack(id, {x:0,y:0})
      expect(result.hit).toBe(true)
      expect(result.cell_left).toBe(2)
      expect(result.win).toBe(false)
      expect(result.turn).toBe(1)
    })

    test ('Attack same cell return error', async () => {
      id = await service.newGame()
      repo.gameState[id-1].board = placed
      repo.gameState[id-1].state = GameStateId.PLAYING
      await service.attack(id, {x:0,y:0})
      await expect(service.attack(id, {x:0,y:0})).rejects.toThrow(ApiError)
    })

    test ('Game end when all ship sink', async () => {
      id = await service.newGame()
      repo.gameState[id-1].board = placed
      repo.gameState[id-1].state = GameStateId.PLAYING
      await service.attack(id, {x:0,y:0})
      await service.attack(id, {x:0,y:1})
      const result = await service.attack(id, {x:2,y:1})
      expect(result.win).toBe(true)
      expect(result.turn).toBe(3)
      expect(repo.gameState[id-1].state).toBe(GameStateId.END)
    })
  })
})