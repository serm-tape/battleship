import Joi from '@hapi/joi'

const PositionSchema = Joi.object().keys({
  x: Joi.number().required(),
  y: Joi.number().required()
})

export default PositionSchema
