import mongoose from 'mongoose'

const GameStateSchema = new mongoose.Schema({
  hp: Number,
  board: [[Number]],
  turn: Number,
  state: Number,
  ship_size: [Number],
  ship_placed: [{count: Number, limit: Number}],
})

export default GameStateSchema
