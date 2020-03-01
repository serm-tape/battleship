import Joi from '@hapi/joi'
import PositionSchema from './PositionSchema'

const AttackRequestSchema = Joi.object({
  board: Joi.string().required(),
  position: PositionSchema.required(),
})

export default AttackRequestSchema
