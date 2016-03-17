var $ = require('jquery');
var d3 = require('d3');
window.onload = function () {


$(document).ready(function () {
  var data = $('div').data('data');
    console.log($('div').data('data'));
  console.log('hello, you got something')
  console.log(data)
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatDate = d3.time.format("%d-%b-%y");

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

// var xAxis = d3.svg.axis()
//     .scale(x)
//     .orient("bottom");



var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




x.domain(d3.extent(data, function(d) { return new Date(d.created_at); }));
y.domain([0, d3.max(data.map(function(item){return parseFloat(item.value)}))]);




    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(new Date(d.created_at)); })
    .y(function(d) { return y(parseFloat(d.value)); });
var axis = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .attr("dy", ".71em")
    .call(x.axis = d3.svg.axis().scale(x).orient("bottom"));
  // svg.append("g")
  //     .attr("class", "x axis")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(axis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Load Avg");
  var clipPath = svg.append("g")
    .attr('clip-path', "url(#clip)");

  var path = svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
// });


function poll(fn, callback, errback, timeout, interval) {
    var endTime = Number(new Date()) + (timeout || 2000);
    interval = interval || 100;

    (function p() {
            // If the condition is met, we're done!
            if(fn()) {
                callback();
            }
            // If the condition isn't met but the timeout hasn't elapsed, go again
            // else if (Number(new Date()) < endTime) {

            // }
            // Didn't match and too much time, reject!
            else {
                errback(new Error('timed out for ' + fn + ': ' + arguments));
            }
            setTimeout(p, interval);
    })();
}

// Usage:  ensure element is visible
poll(
    function() {
        $.get('/uptime', function(newData,err) {
            console.log(newData.value);
            data.unshift(newData);

        //     console.log(data);
            // path.transition()
            // .attr("d", line)
            // .attr("transform", "translate(" +-20+ ")")
            // .attr("transform", null);

            // x.domain([new Date().getSeconds() - 10000, new Date()]);
            // y.domain([d3.min(data.map(function(item){return parseFloat(item.value)})), d3.max(data.map(function(item){return parseFloat(item.value)}))]);

            path
            .attr("d", line)
            .attr("transform", null)
            .transition()
            .attr("transform", "translate(" + -13 + ")");

            x.domain(d3.extent(data, function(d) { return new Date(d.created_at); }));
            axis.call(x.axis);
            y.domain([0, d3.max(data.map(function(item){return parseFloat(item.value)}))]);
            d3.select('.y.axis').call(yAxis);
            // svg.call(y.axis);
            data.pop();
        //         data.pop();
        //     var createdAtArray = data.map(function(item){return new Date(item.created_at)});
        //     var minTime = d3.min(createdAtArray);
        //     var maxTime = d3.max(createdAtArray);

        //     console.log('min and max times, ', minTime, maxTime);
        //     var n = 60,
        //     duration = 10000,
        //     // now = new Date(Date.now() - duration),
        //     count = 0;
        //     now = new Date();
        //     x.domain([minTime, maxTime]);
        //     y.domain([d3.min(data.map(function(item){return parseFloat(item.value)})), d3.max(data.map(function(item){return parseFloat(item.value)}))]);
        //     console.log(newData[0].value)
        //     // push the accumulated count onto the back, and reset the count

        //     count = 0;

        //     // redraw the line
        //     // svg.select(".line")
        //     //     .attr("d", line)
        //     //     .attr("transform", null);

        //     // slide the x-axis left
        //     axis.call(x.axis);

        //     // slide the line left
        //     // console.log( 'translation, ' ,now - (n - 10) * duration )
        //     // console.log( 'now, ' ,now )
        //     path.transition()
        //         .attr("transform", "translate(" + -16 + ")");
        //         data.pop();

        //         // x(maxTime - n * duration )
        //     // pop the old data point off the front
        //     // scrollData.shift();
        //     // .attr("transform", "translate(" + x(-1) + ")");
        //     // daxta.shift();
        });
    },
    function() {
        // Done, success callback
    },
    function() {
        // Error, failure callback
    }
, null, 10000);
});

}
