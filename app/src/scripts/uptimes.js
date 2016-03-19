var $ = require('jquery');
var d3 = require('d3');
var poll = require('./utils').poll;

module.exports = function () {
  var data = $('div').data('data');
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  function createScales(data) {

    var x = d3.time.scale()
    .range([0, width]);

    var y = d3.scale.linear()
    .range([height, 0]);

    x.domain(d3.extent(data, function(d) { return new Date(d.created_at); }));
    y.domain([0, d3.max(data.map(function(item){return parseFloat(item.value)}))]);

    return {x: x, y: y};
  }

  function createAxes(svg, xY) {
    var axis = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .attr("dy", ".71em")
    .call(xY.x.axis = d3.svg.axis().scale(xY.x).orient("bottom"));

    var yAxis = d3.svg.axis()
    .scale(xY.y)
    .orient("left");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Load Avg");

      return {axis: axis, yAxis: yAxis};
  }

  function drawLine (svg, xY, data) {
    var line = d3.svg.line()
    .x(function(d) { return xY.x(new Date(d.created_at)); })
    .y(function(d) { return xY.y(parseFloat(d.value)); });



    var clipPath = svg.append("g")
    .attr('clip-path', "url(#clip)");

    var path = svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

    return {path: path, line:line};
  }

  function drawChartBounds () {
    var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    return svg;
  }

  function redrawLine (pathLine) {
    pathLine.path
    .attr("d", pathLine.line)
    .attr("transform", null)
    .transition()
    .attr("transform", "translate(" + -13 + ")");
  }

  function updateDomains (xY, axes) {
    xY.x.domain(d3.extent(data, function(d) { return new Date(d.created_at); }));
    axes.axis.call(xY.x.axis);
    xY.y.domain([0, d3.max(data.map(function(item){return parseFloat(item.value)}))]);
    d3.select('.y.axis').call(axes.yAxis);
  }

  function init () {
    var svg = drawChartBounds();
    var xY = createScales(data);
    var axes = createAxes(svg, xY);
    var pathLine = drawLine(svg, xY, data);


    poll(
      function() {
        $.get('/uptime', function(newData,err) {
          data.unshift(newData);
          redrawLine(pathLine);
          updateDomains(xY, axes);
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

  return {
    init: init
  };
};
