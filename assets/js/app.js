// @TODO: YOUR CODE HERE!


var svgWidth = 800;
var svgHeight = 500;

var margin = {
  top: 50,
  right: 60,
  bottom: 100,
  left: 60
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("/assets/data/data.csv").then(data => {
    console.log(data)
    
    data.forEach(d => {
        d.age = +d.age;
        d.healthcare = +d.healthcare;
        d.income = +d.income;
        d.obesity = +d.obesity;
        d.poverty = +d.poverty;
        d.smokes = +d.smokes;
    })

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.poverty) - 1, d3.max(data, d => d.poverty) + 1])
        .range([0, width]);
    
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.healthcare) - 1, d3.max(data, d => d.healthcare) + 1])
        .range([height, 0])
    
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);
    
    // append axes
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
    
    chartGroup.append("g")
        .call(yAxis);
    

    var circles = chartGroup.selectAll("g.circle")
    
    circles = circles.data(data)
        .enter()
        .append("g")
        .classed("stateCircle", true)

    circles.append("svg:circle")

    circles.selectAll("circle")
        .attr("cx", d=> xLinearScale(d.poverty))
        .attr("cy", d=> yLinearScale(d.healthcare))
        .attr("r", "9")
    
    circles.append("text")

    circles.selectAll("text")
        .text(d => d.abbr)
        .attr("text-anchor", "middle")
        .attr("x", d=> xLinearScale(d.poverty))
        .attr("y", d=> yLinearScale(d.healthcare) +3)
        .attr("font-size", "0.5em")
        .classed("stateText", true)
    
    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .classed("active", true)
    .text("In Poverty (%)")

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0-height/2)
    .attr("y", 0-margin.left)
    .attr("dy", "1em")
    .classed("active", true)
    .text("Lacks Healthcare (%)");
})
