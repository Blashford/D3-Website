// @TODO: YOUR CODE HERE!


var svgWidth = 800;
var svgHeight = 500;

var margin = {
    top: 50,
    right: 60,
    bottom: 100,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(data => {
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
        .range([height, 0]);

    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // append axes
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .classed("xAxis", true)
        .call(xAxis);

    chartGroup.append("g")
        .classed("yAxis", true)
        .call(yAxis);
    
    var xAxisKey = "";
    var xAxisValue = "";
    var yAxisKey = "";
    var yAxisValue = "";
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-3, 0])
        .html(function (d) { 
            xAxisKey = "Poverty";
            xAxisValue = d.poverty + "%";
            yAxisKey = "Lacks Healthcare";
            yAxisValue = d.healthcare + "%";
                return `${d.state} <br> ${xAxisKey}: ${xAxisValue} <br> ${yAxisKey}: ${yAxisValue}`; });
    svg.call(toolTip);
    
    var circles = chartGroup.selectAll("g.circle");

    circles = circles.data(data)
        .enter()
        .append("g")
        .classed("stateCircle", true)
        .on("mouseover", toolTip.show)
        .on("mouseout", toolTip.hide);

    circles.append("svg:circle");

    circles.selectAll("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "9");

    circles.append("text");

    circles.selectAll("text")
        .text(d => d.abbr)
        .attr("text-anchor", "middle")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare) + 3)
        .attr("font-size", "0.5em")
        .classed("stateText", true);

    

    var poverty = chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .classed("active", true)
        .text("In Poverty (%)");

    var age = chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("dy", "1.25em")
        .classed("inactive", true)
        .text("Age (Median)");

    var income = chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("dy", "2.5em")
        .classed("inactive", true)
        .text("Household Income (Median)");

    var healthcare = chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - height / 2)
        .attr("y", 0 - margin.left)
        .attr("dy", "4.25em")
        .classed("active", true)
        .text("Lacks Healthcare (%)");

    var smokes = chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - height / 2)
        .attr("y", 0 - margin.left)
        .attr("dy", "3em")
        .classed("inactive", true)
        .text("Smokes (%)");

    var obese = chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - height / 2)
        .attr("y", 0 - margin.left)
        .attr("dy", "1.75em")
        .classed("inactive", true)
        .text("Obese (%)");


    age.on("click", function (d) {
        age.attr("class", "active");
        poverty.attr("class", "inactive");
        income.attr("class", "inactive");

        var selected = d3.selectAll(".stateCircle");
        xLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.age) - 1, d3.max(data, d => d.age) + 1])
            .range([0, width]);
        xAxis = d3.axisBottom(xLinearScale);

        d3.select(".xAxis")
            .transition()
            .duration(500)
            .call(xAxis);

        selected.selectAll("circle")
            .transition()
            .duration(500)
            .attr("cx", data => xLinearScale(data.age));

        selected.selectAll("text")
            .transition()
            .duration(500)
            .attr("x", data => xLinearScale(data.age));

        toolTip.html(function (d) { 
            xAxisKey = "Age";
            xAxisValue = d.age;
                return `${d.state} <br> ${xAxisKey}: ${xAxisValue} <br> ${yAxisKey}: ${yAxisValue}`; })
        
    });

    poverty.on("click", function (d) {
        age.attr("class", "inactive");
        poverty.attr("class", "active");
        income.attr("class", "inactive");

        var selected = d3.selectAll(".stateCircle");
        xLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.poverty) - 1, d3.max(data, d => d.poverty) + 1])
            .range([0, width]);
        xAxis = d3.axisBottom(xLinearScale);

        d3.select(".xAxis")
            .transition()
            .duration(500)
            .call(xAxis);

        selected.selectAll("circle")
            .transition()
            .duration(500)
            .attr("cx", data => xLinearScale(data.poverty));

        selected.selectAll("text")
            .transition()
            .duration(500)
            .attr("x", data => xLinearScale(data.poverty));

        toolTip.html(function (d) { 
            xAxisKey = "Poverty";
            xAxisValue = d.poverty + "%";
                return `${d.state} <br> ${xAxisKey}: ${xAxisValue} <br> ${yAxisKey}: ${yAxisValue}`; })
    });

    income.on("click", function (d) {
        age.attr("class", "inactive");
        poverty.attr("class", "inactive");
        income.attr("class", "active");

        var selected = d3.selectAll(".stateCircle");
        xLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.income) - 1000, d3.max(data, d => d.income) + 1000])
            .range([0, width]);
        xAxis = d3.axisBottom(xLinearScale);
        d3.select(".xAxis")
            .transition()
            .duration(500)
            .call(xAxis);

        selected.selectAll("circle")
            .transition()
            .duration(500)
            .attr("cx", data => xLinearScale(data.income));

        selected.selectAll("text")
            .transition()
            .duration(500)
            .attr("x", data => xLinearScale(data.income));

        toolTip.html(function (d) { 
            xAxisKey = "Income";
            xAxisValue = "$" + d.income;
            
                return `${d.state} <br> ${xAxisKey}: ${xAxisValue} <br> ${yAxisKey}: ${yAxisValue}`; })
    });

    healthcare.on("click", function (d) {
        healthcare.attr("class", "active");
        smokes.attr("class", "inactive");
        obese.attr("class", "inactive");

        var selected = d3.selectAll(".stateCircle");
        yLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.healthcare) - 1, d3.max(data, d => d.healthcare) + 1])
            .range([height, 0]);
        yAxis = d3.axisLeft(yLinearScale);
        d3.select(".yAxis")
            .transition()
            .duration(500)
            .call(yAxis);

        selected.selectAll("circle")
            .transition()
            .duration(500)
            .attr("cy", data => yLinearScale(data.healthcare));

        selected.selectAll("text")
            .transition()
            .duration(500)
            .attr("y", data => yLinearScale(data.healthcare) + 3);

        toolTip.html(function (d) { 
            yAxisKey = "Lacks Healthcare";
            yAxisValue = d.healthcare + "%";
            
                return `${d.state} <br> ${xAxisKey}: ${xAxisValue} <br> ${yAxisKey}: ${yAxisValue}`; })
    });

    smokes.on("click", function (d) {
        healthcare.attr("class", "inactive");
        smokes.attr("class", "active");
        obese.attr("class", "inactive");

        var selected = d3.selectAll(".stateCircle");
        yLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.smokes) - 1, d3.max(data, d => d.smokes) + 1])
            .range([height, 0]);
        yAxis = d3.axisLeft(yLinearScale);
        d3.select(".yAxis")
            .transition()
            .duration(500)
            .call(yAxis);

        selected.selectAll("circle")
            .transition()
            .duration(500)
            .attr("cy", data => yLinearScale(data.smokes));

        selected.selectAll("text")
            .transition()
            .duration(500)
            .attr("y", data => yLinearScale(data.smokes) + 3);

        toolTip.html(function (d) { 
            yAxisKey = "Smokes";
            yAxisValue = d.smokes + "%";
            
                return `${d.state} <br> ${xAxisKey}: ${xAxisValue} <br> ${yAxisKey}: ${yAxisValue}`; })
    });

    obese.on("click", function (d) {
        healthcare.attr("class", "inactive");
        smokes.attr("class", "inactive");
        obese.attr("class", "active");

        var selected = d3.selectAll(".stateCircle");
        yLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.obesity) - 1, d3.max(data, d => d.obesity) + 1])
            .range([height, 0]);
        yAxis = d3.axisLeft(yLinearScale);
        d3.select(".yAxis")
            .transition()
            .duration(500)
            .call(yAxis);

        selected.selectAll("circle")
            .transition()
            .duration(500)
            .attr("cy", data => yLinearScale(data.obesity));

        selected.selectAll("text")
            .transition()
            .duration(500)
            .attr("y", data => yLinearScale(data.obesity) + 3);

        toolTip.html(function (d) { 
            yAxisKey = "Obese";
            yAxisValue = d.obesity + "%";
            
                return `${d.state} <br> ${xAxisKey}: ${xAxisValue} <br> ${yAxisKey}: ${yAxisValue}`; })
    });
});
