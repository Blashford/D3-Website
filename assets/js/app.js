// @TODO: YOUR CODE HERE!

d3.csv("/assets/data/data.csv").then(data => {
    console.log(data)

var svgWidth = 1000;
var svgHeight = 500;

var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", height)
    .attr("width", width);


})
