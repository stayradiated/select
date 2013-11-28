fs      = require 'fs'
Scrunch = require 'coffee-scrunch'

input  = './source/api.js'
output = './app/mouse.js'

init = (scrunch) ->

  scrunch.vent.on 'init', ->
    scrunch.scrunch()

  scrunch.vent.on 'scrunch', (data) ->
    console.log '...writing'
    fs.writeFile output, data

  scrunch.init()

task 'watch', ->
  init new Scrunch
    path: input
    compile: true
    watch: true

task 'build', ->
  init new Scrunch
    path: input
    compile: true
    verbose: true


