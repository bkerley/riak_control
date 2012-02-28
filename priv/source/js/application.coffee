$(document).ready ->
  rand = Math.random
  class ErlangMemoryChart
    constructor: ->
      @scheduleNext()
      @canvases = [$('#canvas-1'), $('#canvas-2')]
      @bufs = [Raphael('canvas-1', 640, 480), Raphael('canvas-2', 640, 480)]
    scheduleNext: ->
      hello = => @drawGraph.apply(this)
      window.setTimeout(hello, 1000)
    drawGraph: ->
      $.getJSON('/admin/cluster/list', (j) =>
        @backbuf = @bufs[1]
        @chart = @backbuf.linechart(0, 0, 640, 480, [1, 2, 3, 4, 5],
        [
          [rand(), rand(), rand(), rand(), rand()],
          [rand(), rand(), rand(), rand(), rand()]],
          {
            shade: true
          })
        @canvases[1].removeClass('hide')
        @canvases[0].addClass('hide')
        @canvases.reverse()
        @bufs.reverse()
        @bufs[1].clear()
        @scheduleNext()
      )
  window.hi = new ErlangMemoryChart