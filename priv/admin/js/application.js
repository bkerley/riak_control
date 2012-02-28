(function() {

  $(document).ready(function() {
    var poll, rand,
      _this = this;
    window.Start = function() {
      window.Cluster = new window.RiakCluster();
      window.Chart = new window.MemoryChartView({
        model: window.Cluster
      });
      return poll();
    };
    poll = function() {
      window.Cluster.load();
      return window.setTimeout(poll, 500);
    };
    window.RiakCluster = (function() {

      function RiakCluster() {
        this.nodes = [];
      }

      RiakCluster.prototype.load = function() {
        var _this = this;
        return $.getJSON('/admin/cluster/list', function(j) {
          return _this.consume(j);
        });
      };

      RiakCluster.prototype.consume = function(returned) {
        var entry;
        this.nodes = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = returned.length; _i < _len; _i++) {
            entry = returned[_i];
            _results.push(new RiakNode(entry));
          }
          return _results;
        })();
        return window.Chart.trigger('cluster:loaded');
      };

      return RiakCluster;

    })();
    window.RiakNode = (function() {

      function RiakNode(d) {
        this.d = d;
        this.mem_total_history = [];
        this.mem_used_history = [];
        this.mem_erlang_history = [];
        this.update(this.d);
      }

      RiakNode.prototype.update = function(d) {
        this.d = d;
        _.extend(this, this.d);
        return this.shiftHistory();
      };

      RiakNode.prototype.shiftHistory = function() {
        this.mem_total_history.push(this.mem_total / (1024 * 1024));
        if (this.mem_total_history.length > 20) this.mem_total_history.shift();
        this.mem_used_history.push(this.mem_used / (1024 * 1024));
        if (this.mem_used_history.length > 20) this.mem_used_history.shift();
        this.mem_erlang_history.push(this.mem_erlang / (1024 * 1024));
        if (this.mem_erlang_history.length > 20) {
          return this.mem_erlang_history.shift();
        }
      };

      return RiakNode;

    })();
    window.ErlangMemoryChart = (function() {

      function ErlangMemoryChart() {
        this.canvases = [$('#canvas-1'), $('#canvas-2')];
        this.bufs = ['canvas-1', 'canvas-2'];
      }

      ErlangMemoryChart.prototype.drawGraph = function(cluster) {
        var chart_data, chart_range, history_size, node;
        history_size = cluster.nodes[0].mem_erlang_history.length;
        chart_data = (function() {
          var _i, _len, _ref, _results;
          _ref = cluster.nodes;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            _results.push(node.mem_erlang_history);
          }
          return _results;
        })();
        chart_range = (function() {
          var _i, _len, _ref, _results;
          _ref = cluster.nodes;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            _results.push(_.range(0, history_size));
          }
          return _results;
        })();
        this.backbuf = this.bufs[1];
        this.chart = new Ico.LineGraph(this.backbuf, chart_data, {
          width: 640,
          height: 480
        });
        this.canvases[1].removeClass('hide');
        this.canvases[0].addClass('hide');
        this.canvases.reverse();
        this.bufs.reverse();
        return this.canvases[1].html('');
      };

      return ErlangMemoryChart;

    })();
    window.MemoryChartView = Backbone.View.extend({
      initialize: function() {
        var _this = this;
        this.chart = new ErlangMemoryChart;
        return this.on('cluster:loaded', function() {
          return _this.render();
        });
      },
      tagName: 'div',
      render: function() {
        return this.chart.drawGraph(this.model);
      }
    });
    return rand = Math.random;
  });

}).call(this);
