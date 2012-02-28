(function() {

  $(document).ready(function() {
    var ErlangMemoryChart, rand;
    rand = Math.random;
    ErlangMemoryChart = (function() {

      function ErlangMemoryChart() {
        this.scheduleNext();
        this.canvases = [$('#canvas-1'), $('#canvas-2')];
        this.bufs = [Raphael('canvas-1', 640, 480), Raphael('canvas-2', 640, 480)];
      }

      ErlangMemoryChart.prototype.scheduleNext = function() {
        var hello,
          _this = this;
        hello = function() {
          return _this.drawGraph.apply(_this);
        };
        return window.setTimeout(hello, 1000);
      };

      ErlangMemoryChart.prototype.drawGraph = function() {
        var _this = this;
        return $.getJSON('/admin/cluster/list', function(j) {
          _this.backbuf = _this.bufs[1];
          _this.chart = _this.backbuf.linechart(0, 0, 640, 480, [1, 2, 3, 4, 5], [[rand(), rand(), rand(), rand(), rand()], [rand(), rand(), rand(), rand(), rand()]], {
            shade: true
          });
          _this.canvases[1].removeClass('hide');
          _this.canvases[0].addClass('hide');
          _this.canvases.reverse();
          _this.bufs.reverse();
          _this.bufs[1].clear();
          return _this.scheduleNext();
        });
      };

      return ErlangMemoryChart;

    })();
    return window.hi = new ErlangMemoryChart;
  });

}).call(this);
