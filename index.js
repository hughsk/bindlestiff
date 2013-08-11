var bs = module.exports = {}
var Component = require('./component')
var inherits = require('inherits')
var Manager = require('./manager')
var Entity = require('./entity')

bs.Entity = Entity

bs.manager = Manager
bs.component = Component

bs.define = function() {
  inherits(CustomEntity, Entity)
  function CustomEntity() {
    Entity.call(this)
  }
  return CustomEntity
}
