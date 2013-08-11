var bindle = require('bindle')

module.exports = Component

function Component(tags) {
  tags = tags || []
  tags = Array.isArray(tags) ? tags : [tags]

  var mixin = bindle.mixin()

  component.on = on
  function component(Child) {
    var proto = Child.prototype

    mixin(Child)
    proto._bindleTags = proto._bindleTags || []
    for (var i = 0; i < tags.length; i += 1) {
      if (proto._bindleTags.indexOf(tags[i]) === -1) proto._bindleTags.push(tags[i])
    }
  }

  function on() {
    mixin.on.apply(null, arguments)
    return component
  }

  return component
}
