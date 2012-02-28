(function() {

  $(document).ready(function() {
    var Hello, hi;
    Hello = (function() {

      function Hello() {
        this.scheduleNext();
      }

      Hello.prototype.scheduleNext = function() {
        var hello,
          _this = this;
        hello = function() {
          return _this.writeHello.apply(_this);
        };
        return window.setTimeout(hello, 1000);
      };

      Hello.prototype.writeHello = function() {
        $('#toots').append("<li>asdf</li>");
        return this.scheduleNext();
      };

      return Hello;

    })();
    return hi = new Hello;
  });

}).call(this);
