var inherits = require('inherits')
  , Entity = require('./entity')
  , emptyArray = []

module.exports = Entity.extend(Manager)
function Manager() {
  if (!(this instanceof Manager)) return new Manager()
  Entity.call(this)

  this.instances = []
  this.types = []
  this.taggedTypes = {}
  this.taggedInstances = {}
}

/**
 * Returns the entity *types* registered with this manager.
 *
 * Useful for testing different registered entity types meet
 * certain critera.
 *
 * @param {String} tag An optional tag to filter the results by.
 */
Manager.prototype.tagged = function(tag) {
  if (tag) return this.taggedTypes[tag] || emptyArray
  return this.types
}

/**
 * Returns the entity *instances* registered with this manager.
 *
 * @param {String} tag An optional tag to filter the results by.
 */
Manager.prototype.find = function(tag) {
  if (tag) return this.taggedInstances[tag] || emptyArray
  return this.instances
}

/**
 * Adds an entity to the manager
 */
Manager.prototype.add = function(entity) {
  var tags = entity._bindleTags
    , tag

  this.instances.push(entity)
  var i = tags.length
  while (i--) {
    tag = tags[i]

    if (!this.taggedInstances[tag]) {
      this.taggedInstances[tag] = []
      this.taggedTypes[tag] = []
    }

    this.taggedInstances[tag].push(entity)
    this.taggedTypes[tag].push(entity._bindleParent)
  }

  entity.trigger('add')
  return entity
}

/**
 * Removes an entity from the manager
 */
Manager.prototype.remove = function(entity) {
  var tags = entity._bindleTags
    , tagGroup
    , index

  index = this.instances.indexOf(entity)
  if (index !== -1) this.instances.splice(index, 1)

  var i = tags.length
  while (i--) {
    tagGroup = this.taggedInstances[tags[i]]
    index = tagGroup.indexOf(entity)
    if (index !== -1) tagGroup.splice(index, 1)
  }

  entity.trigger('remove')
  return entity
}
