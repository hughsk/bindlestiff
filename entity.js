var inherits = require('inherits')
  , bindle = require('bindle')
  , clone = require('clone')

module.exports = Entity
inherits(Entity, bindle)

function Entity() {
  this.trigger('init')
}

Entity.extend = extendFrom(Entity)
function extendFrom(Parent) {
  return function extend(Child, params) {
    if (typeof Child !== 'function' && arguments.length) {
      params = Child
      Child = DefaultChild
    }
    function DefaultChild() {
      Parent.call(this)
    }

    Child = Child || DefaultChild
    inherits(Child, Parent)

    Child.extend = extendFrom(Child)
    Child.tag = Parent.tag
    Child.use = Parent.use

    Child.prototype._bindle = clone(Parent.prototype._bindle)
    Child.prototype._bindleTags = []
    Child.prototype._bindleParent = Child
    Array.prototype.push.apply(Child.prototype._bindleTags, Parent.prototype._bindleTags)

    if (params) Object.keys(params).forEach(function(key) {
      Child.prototype[key] = params[key]
    })

    return Child
  }
}

Entity.use = function(component) {
  if (component && typeof component === 'function') component(this)
  return this
}

Entity.tag = function(tags) {
  var proto = this.prototype

  tags = tags || []
  tags = Array.isArray(tags) ? tags : [tags]
  proto._bindleTags = proto._bindleTags || []

  var i = tags.length

  while (i--) {
    if (proto._bindleTags.indexOf(tags[i]) === -1) {
      proto._bindleTags.push(tags[i])
    }
  }

  return this
}

Entity.on = function(name, handler) {
  bindle.mixin().on(name, handler)(Entity)
  return Entity
}

Entity.prototype._bindle = {}
Entity.prototype._bindleTags = []
Entity.prototype._bindleParent = Entity
