var svgWidth = 960;
var svgHeight = 600;

var margin = {
    top: 50,
    right: 40,
    bottom: 90,
    left: 100
  };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Initialize default axis Parameters
var chosenXAxis = "PovertyRate";
var chosenYAxis = "StudentDebtAmount"


// pull in data
d3.csv("county_census_debt_data_byState.csv")
  .then(function(data) {

    data.forEach(function(data) {
      data.StudentDebtAmount = +data.StudentDebtAmount;
      data.PovertyRate = +data.PovertyRate;
      data.abbr = data.abbr;
      data.state = data.state;
      console.log(data.StudentDebtAmount);
    });

    // Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(data, d => d.PovertyRate)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([15000, d3.max(data, d => d.StudentDebtAmount)])
      .range([height, 0]);

    // Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    //  Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.PovertyRate))
    .attr("cy", d => yLinearScale(d.StudentDebtAmount))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".8")

    // Create text labels for circles
    var textGroup = chartGroup.selectAll(".label")
     .data(data)
     .enter()
     .append("text")
     .attr("class", "label")
     .attr("text-anchor", "middle")
     .text(function(d) {return d.abbr;})
     .attr("x", d => xLinearScale(d.PovertyRate))
     .attr("y", d => yLinearScale(d.StudentDebtAmount)+6)
     .attr("fill", "white")
     .attr("font-size", "12px")
     .attr("font-family","Arial");
  
    // Initialize tool tip... not sure if I need this
    // ==============================
//    //var toolTip = d3.tip()
//       .attr("class", "tooltip")
//       .offset([25, 0])
//       .html(function(d) {
//         return (`${d.abbr}`);
//       });

    // Create tooltip in the chart
    // ==============================
     chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip... not sure if I need this
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks StudentDebtAmount (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top })`)
      .attr("class", "axisText")
      .text("PovertyRate (%)");
  });

