import Joi from '@hapi/joi'
import PositionSchema from './PositionSchema'

const PlaceShipRequestSchema = Joi.object({
  board: Joi.string().required(),
  ship: Joi.number().min(1).max(4).required(),
  position: PositionSchema.required(),
  arrangement: Joi.string().valid('H', 'V').required()
})

export default PlaceShipRequestSchema
