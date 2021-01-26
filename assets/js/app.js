// @TODO: YOUR CODE HERE!

// Here we set the svg area
var svgWidth = 800;
var svgHeight = 600;

// and the margins so the axes labels will fit in the svg
var margin = {
    top: 50,
    right: 60,
    bottom: 100,
    left: 100
};

// this is to set the height and width of the chart inside of the svg 
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// here is where we input the svg into the html
var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// This is where we add the group element to the svg, this is where our chart is going to go
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// then we call our data and we work inside of the promise
d3.csv("assets/data/data.csv").then(data => {
    // log the data so we can see how it looks
    console.log(data)

    // looking at the data, almost everything is in strings, so we do this to change them into numeric datatypes so that we can work with them
    data.forEach(d => {
        d.age = +d.age;
        d.healthcare = +d.healthcare;
        d.income = +d.income;
        d.obesity = +d.obesity;
        d.poverty = +d.poverty;
        d.smokes = +d.smokes;
    })

    // here we set up our axes, note how we don't go from 0 to the max, this way we don't have a big empty space to the left or the bottom of the graph
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.poverty) - 1, d3.max(data, d => d.poverty) + 1])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.healthcare) - 1, d3.max(data, d => d.healthcare) + 1])
        .range([height, 0]);

    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // then we append the axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .classed("xAxis", true) // here we apply a class to the axis so we can manipulate it later
        .call(xAxis);

    chartGroup.append("g")
        .classed("yAxis", true) // and the same here
        .call(yAxis);
    
    // here we initialize these variables so we can manipulate them inside of the different tooltip functions
    var xAxisKey = "Poverty";
    var xAxisValue = "";
    var yAxisKey = "Lacks Healthcare";
    var yAxisValue = "";

    // then we have our tooltips
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-3, 0])
        .html(function (d) { 
            // here we have the initial tooltips with the axes that the page loads on
            xAxisKey = "Poverty";
            xAxisValue = d.poverty + "%";
            yAxisKey = "Lacks Healthcare";
            yAxisValue = d.healthcare + "%";
                return `${d.state} <br> ${xAxisKey}: ${xAxisValue} <br> ${yAxisKey}: ${yAxisValue}`; });
    svg.call(toolTip);
    
    // here we make our circles selection
    var circles = chartGroup.selectAll("g.circle");
    
    //then we add our data to the selection, append another svg group element, class it to apply style, and add the tooltip listeners
    circles = circles.data(data)
        .enter()
        .append("g")
        .classed("stateCircle", true)
        .on("mouseover", toolTip.show)
        .on("mouseout", toolTip.hide);
    
    // now we add the circles
    circles.append("svg:circle");
    
    // then we apply the data to the circles so they know where they should be
    circles.selectAll("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "9");
    
    // then we append a text element to the same group
    circles.append("text");
    
    // and we add the state abbreviations to the middle of the circles
    circles.selectAll("text")
        .text(d => d.abbr)
        .attr("text-anchor", "middle")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare) + 3) // this +3 is to make the text more centered inside the circles
        .attr("font-size", "0.5em")
        .classed("stateText", true); // and we class it to apply style

    
    // this next chunk of code is adding the different axes labels
    var poverty = chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .classed("active x", true) // I also add the class "x" to the active x axis label so that I can access it later in the listeners
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
        .classed("active y", true) // here I do the same thing with the active y axis, just with the class "y"
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
    
    // this is a function that formats currency to make the income in the tooltips look nicer
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0
        });

    // next we have all of our listeners for the different labels
    age.on("click", function (d) {
        // first we apply the active and x classes to the active label and make sure the other labels on the same axis are inactive
        age.classed("active x", true)
            .classed("inactive", false);
        poverty.classed("inactive ", true)
            .classed("active x", false);
        income.classed("inactive", true)
            .classed("active x", false);

        // here we update the x axis to the new data
        xLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.age) - 1, d3.max(data, d => d.age) + 1])
            .range([0, width]);
        xAxis = d3.axisBottom(xLinearScale);

        // and we call the x axis again
        d3.select(".xAxis")
            .transition()
            .duration(500)
            .call(xAxis);
        
        // then we select the group that the circles and texts are in
        var selected = d3.selectAll(".stateCircle");

        // and we update the circles and text
        selected.selectAll("circle")
            .transition()
            .duration(500)
            .attr("cx", data => xLinearScale(data.age));

        selected.selectAll("text")
            .transition()
            .duration(500)
            .attr("x", data => xLinearScale(data.age));

        // here we save the text of the current active y axis
        var yAxisText = d3.select(".y").text()
        toolTip.html(function (d) {
            // then we update the tooltips with the current x axis 
            xAxisKey = "Age";
            xAxisValue = d.age;
            // and we have some conditionals to check for the current y axis
            if (yAxisText === "Lacks Healthcare (%)") {
                yAxisKey = "Lacks Healthcare";
                yAxisValue = d.healthcare + "%";
            }
            else if (yAxisText === "Smokes (%)") {
                yAxisKey = "Smokes";
                yAxisValue = d.smokes + "%";
            }
            else {
                yAxisKey = "Obese";
                yAxisValue = d.obesity + "%";
            }
                return `${d.state} <br> ${xAxisKey}: ${xAxisValue} <br> ${yAxisKey}: ${yAxisValue}`; })

        
        
    });

    poverty.on("click", function (d) {
        // first we apply the active and x classes to the active label and make sure the other labels on the same axis are inactive
        age.classed("inactive", true)
            .classed("active x", false);
        poverty.classed("inactive", false)
            .classed("active x", true);
        income.classed("inactive", true)
            .classed("active x", false);

        // here we update the x axis to the new data
        xLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.poverty) - 1, d3.max(data, d => d.poverty) + 1])
            .range([0, width]);
        xAxis = d3.axisBottom(xLinearScale);

        // and we call the x axis again
        d3.select(".xAxis")
            .transition()
            .duration(500)
            .call(xAxis);

        // then we select the group that the circles and texts are in
        var selected = d3.selectAll(".stateCircle");

        // and we update the circles and text
        selected.selectAll("circle")
            .transition()
            .duration(500)
            .attr("cx", data => xLinearScale(data.poverty));

        selected.selectAll("text")
            .transition()
            .duration(500)
            .attr("x", data => xLinearScale(data.poverty));

        // here we save the text of the current active y axis
        var yAxisText = d3.select(".y").text()
        toolTip.html(function (d) { 
            // then we update the tooltips with the current x axis
            xAxisKey = "Poverty";
            xAxisValue = d.poverty + "%";
            // and we have some conditionals to check for the current y axis
            if (yAxisText === "Lacks Healthcare (%)") {
                yAxisKey = "Lacks Healthcare";
                yAxisValue = d.healthcare + "%";
            }
            else if (yAxisText === "Smokes (%)") {
                yAxisKey = "Smokes";
                yAxisValue = d.smokes + "%";
            }
            else {
                yAxisKey = "Obese";
                yAxisValue = d.obesity + "%";
            }
                return `${d.state} <br> ${xAxisKey}: ${xAxisValue} <br> ${yAxisKey}: ${yAxisValue}`; })
    });

    income.on("click", function (d) {
        // first we apply the active and x classes to the active label and make sure the other labels on the same axis are inactive
        age.classed("inactive", true)
            .classed("active x", false);
        poverty.classed("inactive", true)
            .classed("active x", false);
        income.classed("inactive", false)
            .classed("active x", true);

        // here we update the x axis to the new data
        xLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.income) - 1000, d3.max(data, d => d.income) + 1000])
            .range([0, width]);
        xAxis = d3.axisBottom(xLinearScale);
        
        // and we call the x axis again
        d3.select(".xAxis")
            .transition()
            .duration(500)
            .call(xAxis);

        // then we select the group that the circles and texts are in
        var selected = d3.selectAll(".stateCircle");

        // and we update the circles and text
        selected.selectAll("circle")
            .transition()
            .duration(500)
            .attr("cx", data => xLinearScale(data.income));

        selected.selectAll("text")
            .transition()
            .duration(500)
            .attr("x", data => xLinearScale(data.income));

        // here we save the text of the current active y axis
        var yAxisText = d3.select(".y").text()
        toolTip.html(function (d) {
            // then we update the tooltips with the current x axis 
            xAxisKey = "Income";
            xAxisValue = formatter.format(d.income);
            // and we have some conditionals to check for the current y axis
            if (yAxisText === "Lacks Healthcare (%)") {
                yAxisKey = "Lacks Healthcare";
                yAxisValue = d.healthcare + "%";
            }
            else if (yAxisText === "Smokes (%)") {
                yAxisKey = "Smokes";
                yAxisValue = d.smokes + "%";
            }
            else {
                yAxisKey = "Obese";
                yAxisValue = d.obesity + "%";
            }
                return `${d.state} <br> ${xAxisKey}: ${xAxisValue} <br> ${yAxisKey}: ${yAxisValue}`; })
    });

    healthcare.on("click", function (d) {
        // first we apply the active and x classes to the active label and make sure the other labels on the same axis are inactive
        healthcare.classed("inactive", false)
            .classed("active y", true);
        smokes.classed("inactive", true)
            .classed("active y", false);
        obese.classed("inactive", true)
            .classed("active y", false);

        // here we update the y axis to the new data
        yLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.healthcare) - 1, d3.max(data, d => d.healthcare) + 1])
            .range([height, 0]);
        yAxis = d3.axisLeft(yLinearScale);
        
        // and we call the y axis again
        d3.select(".yAxis")
            .transition()
            .duration(500)
            .call(yAxis);

        // then we select the group that the circles and texts are in
        var selected = d3.selectAll(".stateCircle");

        // and we update the circles and text
        selected.selectAll("circle")
            .transition()
            .duration(500)
            .attr("cy", data => yLinearScale(data.healthcare));

        selected.selectAll("text")
            .transition()
            .duration(500)
            .attr("y", data => yLinearScale(data.healthcare) + 3);

        // here we save the text of the current active x axis
        var xAxisText = d3.select(".x").text()
        toolTip.html(function (d) {
            // then we update the tooltips with the current y axis
            yAxisKey = "Lacks Healthcare";
            yAxisValue = d.healthcare + "%";
            // and we have some conditionals to check for the current x axis
            if (xAxisText === "In Poverty (%)") {
                xAxisKey = "Poverty";
                xAxisValue = d.poverty + "%";
            }
            else if (xAxisText === "Age (Median)") {
                xAxisKey = "Age";
                xAxisValue = d.age;
            }
            else {
                xAxisKey = "Household Income (Median)";
                xAxisValue = formatter.format(d.income);
            }
                return `${d.state} <br> ${xAxisKey}: ${xAxisValue} <br> ${yAxisKey}: ${yAxisValue}`; })
    });

    smokes.on("click", function (d) {
        // first we apply the active and x classes to the active label and make sure the other labels on the same axis are inactive
        healthcare.classed("inactive", true)
            .classed("active y", false);
        smokes.classed("inactive", false)
            .classed("active y", true);
        obese.classed("inactive", true)
            .classed("active y", false);

        // here we update the y axis to the new data
        yLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.smokes) - 1, d3.max(data, d => d.smokes) + 1])
            .range([height, 0]);
        yAxis = d3.axisLeft(yLinearScale);
        
        // and we call the y axis again
        d3.select(".yAxis")
            .transition()
            .duration(500)
            .call(yAxis);

        // then we select the group that the circles and texts are in
        var selected = d3.selectAll(".stateCircle");

        // and we update the circles and text
        selected.selectAll("circle")
            .transition()
            .duration(500)
            .attr("cy", data => yLinearScale(data.smokes));

        selected.selectAll("text")
            .transition()
            .duration(500)
            .attr("y", data => yLinearScale(data.smokes) + 3);

        // here we save the text of the current active x axis
        var xAxisText = d3.select(".x").text()
        toolTip.html(function (d) { 
            // then we update the tooltips with the current y axis
            yAxisKey = "Smokes";
            yAxisValue = d.smokes + "%";
            // and we have some conditionals to check for the current x axis
            if (xAxisText === "In Poverty (%)") {
                xAxisKey = "Poverty";
                xAxisValue = d.poverty + "%";
            }
            else if (xAxisText === "Age (Median)") {
                xAxisKey = "Age";
                xAxisValue = d.age;
            }
            else {
                xAxisKey = "Household Income (Median)";
                xAxisValue = formatter.format(d.income);
            }
                return `${d.state} <br> ${xAxisKey}: ${xAxisValue} <br> ${yAxisKey}: ${yAxisValue}`; })
    });

    obese.on("click", function (d) {
        // first we apply the active and x classes to the active label and make sure the other labels on the same axis are inactive
        healthcare.classed("inactive", true)
            .classed("active y", false);
        smokes.classed("inactive", true)
            .classed("active y", false);
        obese.classed("inactive", false)
            .classed("active y", true);

        // here we update the y axis to the new data
        yLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.obesity) - 1, d3.max(data, d => d.obesity) + 1])
            .range([height, 0]);
        yAxis = d3.axisLeft(yLinearScale);
        
        // and we call the y axis again
        d3.select(".yAxis")
            .transition()
            .duration(500)
            .call(yAxis);

        // then we select the group that the circles and texts are in
        var selected = d3.selectAll(".stateCircle");

        // and we update the circles and text
        selected.selectAll("circle")
            .transition()
            .duration(500)
            .attr("cy", data => yLinearScale(data.obesity));

        selected.selectAll("text")
            .transition()
            .duration(500)
            .attr("y", data => yLinearScale(data.obesity) + 3);

        // here we save the text of the current active x axis
        var xAxisText = d3.select(".x").text()
        toolTip.html(function (d) { 
            // then we update the tooltips with the current y axis
            yAxisKey = "Obese";
            yAxisValue = d.obesity + "%";
            // and we have some conditionals to check for the current x axis
            if (xAxisText === "In Poverty (%)") {
                xAxisKey = "Poverty";
                xAxisValue = d.poverty + "%";
            }
            else if (xAxisText === "Age (Median)") {
                xAxisKey = "Age";
                xAxisValue = d.age;
            }
            else {
                xAxisKey = "Household Income (Median)";
                xAxisValue = formatter.format(d.income);
            }
                return `${d.state} <br> ${xAxisKey}: ${xAxisValue} <br> ${yAxisKey}: ${yAxisValue}`; })
    });
});
