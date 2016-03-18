var $ = require('jquery');
var d3 = require('d3');
var poll = require('./utils').poll;

module.exports = function () {
  function init () {
    var data = $('div').data('data');
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
            data.pop();

        });
    },
    function() {
        // Done, success callback
    },
    function() {
        // Error, failure callback
    }
, null, 10000);
  }
  return {init: init}
};
