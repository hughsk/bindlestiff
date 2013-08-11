var test = require('tape')
  , bs = require('./')
  , component = require('./component')
  , Manager = require('./manager')
  , Entity = require('./entity')

test('Entity.extend returns a class descended from Entity', function(t) {
  var Extended = Entity.extend(function(){})
  t.ok(new Extended() instanceof Entity)
  t.end()
})

test('Entity.extend can optionally override prototypes', function(t) {
  function Extended() {}
  Extended.prototype.test = function() { return false }
  Entity.extend(Extended, {
      test: function() { return true }
    , beep: function() { return -100 }
  })

  var extended = new Extended
  t.equal(extended.test(), true)
  t.equal(extended.beep(), -100)
  t.end()
})

test('Manager can find entities by tag', function(t) {
  t.plan(5)

  var Extended = Entity.extend(function(){}).tag('hello')
    , NoTag = Entity.extend(function(){})
    , manager = new Manager
    , entities = []
    , i

  for (i = 0; i < 5; i += 1) {
    entities.push(new Extended)
    manager.add(new NoTag)
    manager.add(entities.slice(-1)[0])
  }

  var found = manager.find('hello')
  for (i = 0; i < 5; i += 1) {
    t.equal(found[i], entities[i])
  }
})

test('Manager can find classes by tag', function(t) {
  var manager = new Manager
    , Hello = Entity.extend(function(){})
    , World = Entity.extend(function(){})
    , Lorem = Entity.extend(function(){})
    , Ipsum = Entity.extend(function(){})

  Hello.tag(['hello', 'developer'])
  World.tag(['world', 'developer'])
  Lorem.tag(['lorem', 'designer'])
  Ipsum.tag(['ipsum', 'designer'])

  manager.add(new Hello)
  manager.add(new World)
  manager.add(new Lorem)
  manager.add(new Ipsum)

  t.equal(manager.tagged('hello')[0], Hello)
  t.equal(manager.tagged('world')[0], World)
  t.equal(manager.tagged('lorem')[0], Lorem)
  t.equal(manager.tagged('ipsum')[0], Ipsum)
  t.deepEqual(manager.tagged('designer'), [Lorem, Ipsum])
  t.deepEqual(manager.tagged('developer'), [Hello, World])

  t.end()
})

test('Once an entity is removed, it can no longer be found', function(t) {
  var manager = new Manager
    , Thing = Entity.extend(function(){})
    , thing

  Thing.tag('thing')

  manager.add(thing = new Thing)
  t.equal(manager.find('thing')[0], thing)
  t.equal(manager.instances[0], thing)

  manager.remove(thing)
  t.equal(manager.find('thing').length, 0)
  t.equal(manager.instances.length, 0)

  t.end()
})

test('Mixins can apply additional tags to a class', function(t) {
  var manager = new Manager
    , Thing = Entity.extend(function(){})
    , thing

  component(['tagger', 'dummy'])(Thing)

  Thing.tag(['thing', 'again'])
  manager.add(thing = new Thing)

  t.equal(manager.find('thing')[0], thing)
  t.equal(manager.find('again')[0], thing)
  t.equal(manager.find('dummy')[0], thing)
  t.equal(manager.find('tagger')[0], thing)

  t.end()
})
