var bindle = require('bindle')

module.exports = Component

function Component(tags) {
  tags = tags || []
  tags = Array.isArray(tags) ? tags : [tags]

  var mixin = bindle.mixin()
  var deps = []

  component.on = on
  function component(Child) {
    var proto = Child.prototype

    mixin(Child)
    proto._bindleTags = proto._bindleTags || []
    for (var i = 0; i < tags.length; i += 1) {
      if (proto._bindleTags.indexOf(tags[i]) === -1) proto._bindleTags.push(tags[i])
    }

    for (var i = 0; i < deps.length; i += 1) {
      if (proto._bindleTags.indexOf(deps[i]) === -1) throw new Error(
        'This component needs "' + deps[i] + '"'
      )
    }
  }

  component.needs = needs
  function needs(tags) {
    tags = Array.isArray(tags) ? tags : [tags]
    deps.push.apply(deps, tags)
    return component
  }

  function on() {
    mixin.on.apply(null, arguments)
    return component
  }

  return component
}
