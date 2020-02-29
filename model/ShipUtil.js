import * as constant from './constant'

const ShipUtil = {
  getShipSize(shipType) => {
    switch (shipType) {
      case constant.BATTLE_SHIP: return constant.BATTLE_SHIP_SIZE
      case constant.DESTROYER: return constant.DESTROYER_SIZE
      case constant.CRUISER: return constant.CRUISER_SIZE
      case constant.SUBMARINE: return constant.SUBMARINE_SIZE
      default throw new Error('invalid ship type')
    }
  }

  getShipLimit(shipType) => {
    switch (shipType) => {
      case constant.BATTLE_SHIP: return constant.BATTLE_SHIP_COUNT
      case constant.DESTROYER: return constant.DESTROYER_COUNT
      case constant.CRUISER: return constant.CRUISER_COUNT
      case constant.SUBMARINE: return constant.SUBMARINE
      default throw new Error('invalid ship type')
    }
  }
}

export default ShipUtil
