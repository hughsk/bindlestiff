# bindlestiff [![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges) #

A light entity/component system for building JavaScript games. Can
easily be used alongside other libraries/modules such as [d3](http://d3js.org),
[voxel.js](http://voxeljs.org), or
[three.js](http://threejs.org) - if you're looking for something lighter
still, the entity's mixin functionality is using
[bindle](http://github.com/hughsk/bindle) under the hood.

Totally experimental, subject to at least one breaking API change, so think
twice before you use this (for now). Built with
[browserify](http://browserify.org/) in mind.

## Installation ##

``` bash
npm install bindlestiff
```

## Example ##

``` javascript
var bs = require('bindlestiff')
var ticker = require('ticker')

var manager = bs.manager()

var physical = bs.component('physical')
  .on('init', function() {
    this.pos[0] = this.spd[0] = 0
    this.pos[1] = this.spd[1] = 0
  })
  .on('tick', function() {
    this.pos[0] += this.spd[0]
    this.pos[1] += this.spd[1]
  })

var controllable = bs.component('controllable')
  .needs('physical')
  .on('tick', function() {
    this.spd[0] = controls.down - controls.up
    this.spd[1] = controls.left - controls.right
  })

var Player = bs.define()
  .use(physical)
  .use(controllable)

var player = new Player

manager.add('player')

ticker(60, canvas).on('tick', function() {
  for (var i = 0; i < manager.instances.length; i += 1) {
    manager.instances[i].trigger('tick')
  }
}).on('draw', function() {
  for (var i = 0; i < manager.instances.length; i += 1) {
    manager.instances[i].trigger('draw')
  }
})
```

## API ##

## Components ##

Components define the behavior of your entities: for example, a `physical`
component could encapsulate all of your physics handling and a `sprite`
component could take care of drawing the entity to the screen.

Components can set properties on their entities, or keep all of their scope
in a closure. They can also react to events and attach tags to entity
definitions.

### `component = bindlestiff.component(tags)` ###

Defines a component. You can optionally pass one or more tags as a string
or array of strings - these are used to label entity definitions so that
entities can be filtered by type by the manager.

### `component.on('event', handler)` ###

Assigns an event listener to this component. The component itself won't
listen to this event, but any entities using this component will call
`handler` when `entity.trigger('event')` is called.

### `component.needs(tag)` ###

Ensures that the entity definition this component is applied has been tagged
with `tag`. If not, the component will throw an error. *Note that order is
important here, you should specify your dependent component after its
dependencies*.

## Entities ##

Entities are the actual "things" in your game: bullets, enemies, players,
blocks, etc. They're created by first defining them, then adding components
and tags, and then instantiating them from the resulting class.

### `EntityDefinition = bindlestiff.define()` ###

Creates a new `EntityDefinition`. This is essentially a class - you can extend
it with components to add additional functionality, effectively getting
multiple inheritance with less boilerplate and overhead.

### `EntityDefinition.use(component)` ###

Attaches a component to the entity definition. Note that components are
actually just functions, and this is just syntactical sugar.

### `EntityDefinition.tag(tags)` ###

Tags any entities with `tags`.

### `EntityDefinition.on('event', handler)` ###

Listen to events on these entities without having to create a new component.

### `entity = new EntityDefinition` ###

After setting up the entity definition, you can create new entities as normal.

### `entity.trigger('event'[, args...])` ###

Instead of attaching methods to an entity definition, it's helpful to use
triggers. They're very similar to Node's `EventEmitter` with the exception
of listeners being defined on the prototype rather then individual instances.

This way, you can trigger `tick` and `draw` on each entity every frame, and
hook into these events with multiple components.

## Manager ##

A manager helps organise and filter your entities, and while it's not necessary
to use it should make your game loop cleaner.

### `manager = bindlestiff.manager()` ###

Creates a new manager.

### `manager.add(entity)` ###

Adds a new entity to the manager.

### `manager.remove(entity)` ###

Removes an entity from the manager.

### `manager.find(tag)` ###

Returns an array of entities that are tagged with `tag`.

### `manager.tagged(tag)` ###

Returns an array of entity definitions that are tagged with `tag`.
