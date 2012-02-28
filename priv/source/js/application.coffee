$(document).ready ->
  window.Start = ->
    window.Cluster = new window.RiakCluster()
    window.Chart = new window.MemoryChartView({model: window.Cluster})
    poll()
  poll = =>
    window.Cluster.load()
    window.setTimeout(poll, 500)

  class window.RiakCluster
    constructor: ->
      @nodes = []
    load: ->
      $.getJSON '/admin/cluster/list', (j) =>
        @consume j
    consume: (returned) ->
      @nodes = (new RiakNode(entry) for entry in returned)
      window.Chart.trigger('cluster:loaded')

  class window.RiakNode
    constructor: (@d) ->
      @mem_total_history = []
      @mem_used_history = []
      @mem_erlang_history = []
      @update(@d)
    update: (@d) ->
      _.extend(this, @d)
      @shiftHistory()
    shiftHistory: ->
      @mem_total_history.push @mem_total / (1024*1024)
      @mem_total_history.shift() if @mem_total_history.length > 20
      @mem_used_history.push @mem_used / (1024*1024)
      @mem_used_history.shift() if @mem_used_history.length > 20
      @mem_erlang_history.push @mem_erlang / (1024*1024)
      @mem_erlang_history.shift() if @mem_erlang_history.length > 20

  class window.ErlangMemoryChart
    constructor: ->
      @canvases = [$('#canvas-1'), $('#canvas-2')]
      @bufs = ['canvas-1', 'canvas-2']
    drawGraph: (cluster)->
      history_size = cluster.nodes[0].mem_erlang_history.length
      chart_data = (node.mem_erlang_history for node in cluster.nodes)
      chart_range = (_.range(0, history_size) for node in cluster.nodes)
      @backbuf = @bufs[1]
      @chart = new Ico.LineGraph @backbuf, chart_data, {
        width: 640,
        height: 480,
        meanline: true,
        units: 'MB'
        }
      @canvases[1].removeClass('hide')
      @canvases[0].addClass('hide')
      @canvases.reverse()
      @bufs.reverse()
      @canvases[1].html('')

  window.MemoryChartView = Backbone.View.extend
    initialize: ->
      @chart = new ErlangMemoryChart
      @on 'cluster:loaded', => @render()
    tagName: 'div'
    render: ->
      @chart.drawGraph(@model)

  rand = Math.random
  # start()