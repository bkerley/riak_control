$(document).ready ->
  class Hello
    constructor: ->
      @scheduleNext()
    scheduleNext: ->
      hello = => @writeHello.apply(this)
      window.setTimeout(hello, 1000)
    writeHello: ->
      $('#toots').append("<li>asdf</li>")
      @scheduleNext()

  hi = new Hello