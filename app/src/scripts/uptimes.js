'use strict';
var $ = require('jquery');
var d3 = require('d3');
var poll = require('./utils').poll;

module.exports = function () {
    var data = $('div').data('data'),
        margin = { top: 20, right: 20, bottom: 30, left: 50 },
        width = 720 - margin.left - margin.right,
        height = 375 - margin.top - margin.bottom;
    /*
        uptimes createScales creates the scales and sets their range and domains
        @return {Object} x (time) and y (load) scales
    */
    function createScales() {
        var x = d3.time.scale()
        .range([0, width]);

        var y = d3.scale.linear()
        .range([height, 0]);

        x.domain(d3.extent(data, function (d) { return new Date(d.created_at); }));
        x.clamp(true);
        y.domain([0, d3.max(data.map(function (item) { return parseFloat(item.value); }))]);
        return { x: x, y: y };
    }

    /*
        uptimes createClipPath creates the clippath and attaches it to our svgj obj. The clippath prevents the line from flowing out of boundaries
        @param {Object} svg container object for our svg chart
        @return {Object} clipPath
    */
    function createClipPath(svg) {
        var defs = svg.append("defs");
        defs.append("clipPath")
        .attr('id', 'clip')
        .append('rect')
        .attr('width', width - 38)
        .attr('height', height - 18);

        var clipPath = svg.append("g")
        .attr('clip-path', "url(#clip)");

        return clipPath;
    }

    /*
        uptimes createAxes creates the x and y axes from our x and y scales and attaches them to our svg obj
        @param {Object} svg container object for our svg chart
        @param {Object} xy object contianing our scale objects
        @return {Object} object containing our axes
    */
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

        return { axis: axis, yAxis: yAxis };
    }

    /*
        uptimes drawLine creates a line calculated with our x and y data. it draws a path from the line and attaches it to our clippath
        @param {Object} clipPath container our  clippath
        @param {Object} xy object contianing our scale objects
        @return {Object} object containing our axes
    */
    function drawLine(clipPath, xY) {
        var line = d3.svg.line()
        .x(function (d) { return xY.x(new Date(d.created_at)); })
        .y(function (d) { return xY.y(parseFloat(d.value)); });

        var path = clipPath.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
        return { path: path, line: line };
    }

    /*
        uptimes drawChartBounds creates our SVG container based on desired width and margin
        @return {Object} our svg container
    */
    function drawChartBounds() {
        var svg = d3.select("#chart-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        return svg;
    }

    /*
        uptimes redrawLine redraws the path based on new data, and moves the path to the left
        @param {Object} pathLine contains our previously drawn path and line
    */
    function redrawLine(pathLine, xY) {
        console.log('data =======> ', data);
        pathLine.path
        .attr("d", pathLine.line)
        .attr("transform", null)
        .transition()
        .attr("transform", "translate(" + xY.x(-1) + ")");
        console.log(xY.x(-1));
    }

    /*
        uptimes updateDomains updates teh domains of our x and y scales
        @param {Object} xy contains our x and y scales
        @param {Object} axes contains our x and y axes
    */
    function updateDomains(xY, axes) {
        xY.x.domain(d3.extent(data, function (d) { return new Date(d.created_at); }));
        axes.axis.call(xY.x.axis);
        xY.y.domain([0, d3.max(data.map(function (item) { return parseFloat(item.value); }))]);
        d3.select('.y.axis').call(axes.yAxis);
    }

    /*
        uptimes init initializes our uptime clientside process, creates the chart and polls for new data every 10 seconds
    */
    function init() {
        var xY;
        var axes;
        var clipPath;
        var pathLine;
        var svg = drawChartBounds();

        // draw the chart if there is enough data to do so
        if (data.length > 2) {

            xY = createScales();
            axes = createAxes(svg, xY);
            clipPath = createClipPath(svg, axes);
            pathLine = drawLine(clipPath, xY);
        }


        poll(
            function () {
                $.get('/uptime', function (newData) {
                    if (newData) {
                        data.unshift(newData);
                    }

                    // redraw the chart if there is enough data to do so
                    if (data.length > 2) {
                        redrawLine(pathLine, xY);
                        updateDomains(xY, axes);

                    // if there wasn't enough data sent from server for initial load,
                    // we need to draw the scales, axes and line down here  for the first time
                    } else if (data.length === 2) {
                        xY = createScales();
                        axes = createAxes(svg, xY);
                        clipPath = createClipPath(svg, axes);
                        pathLine = drawLine(clipPath, xY);
                    }

                    // only need to display ten minutes worth of data
                    if (data.length > 60) {
                        data.pop();
                    }
                });
            }, 10000);
    }

    return {
        init: init
    };
};
