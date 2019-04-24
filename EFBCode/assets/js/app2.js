var svgWidth = 720;
var svgHeight = 375;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg2 = d3
  .select("#scatter2")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup2 = svg2.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Initialize default axis Parameters
var chosenXAxis2 = "Population";
var chosenYAxis2 = "MedicalPercent";

/* Initialize tooltip */
var tip2 = d3.tip()
    .attr('class', 'd3-tip')
    .html(function(d) { return (`State: <strong>${d.State}</strong><hr>${chosenXAxis2}: ${d[chosenXAxis2]}<hr>${chosenYAxis2}: ${d[chosenYAxis2]}`)});

//**********************************************//
// Retrieve data from the csv file and execute everything below
d3.csv("assets/data/data.csv")
    .then(function(data){
        //Step1:  parse data
        data.forEach(function(data) {
            //x values
            data.Population = +data.Population;
            data.HouseholdIncome = +data.HouseholdIncome;
            data.PerCapitaIncome = +data.PerCapitaIncome;
            
            //y values
            data.MedicalPercent = +data.MedicalPercent*100;
            data.StudentDebtPercent = +data.StudentDebtPercent*100;
            data.AutoDebtPercent = +data.AutoDebtPercent*100;
            //state abbreviation and name
            data.abbr = data.abbr;
            data.State = data.State;
            console.log(data.abbr);
        });

        //Step2: Create scale functions
        // Create function to update scale functions upon click
            //create xscale
            function xScale(data, chosenXaxis2){
                var xLinearScale = d3.scaleLinear()
                    .domain([d3.min(data, d => d[chosenXaxis2]),
                             d3.max(data, d => d[chosenXaxis2])])
                    .range(([0, width]));
                return xLinearScale;
            }
                //create yscale
            function yScale(data, chosenYAxis2){
                var yLinearScale = d3.scaleLinear()
                    .domain([d3.min(data, d => d[chosenYAxis2]),
                             d3.max(data, d => d[chosenYAxis2])])
                    .range(([height,0]));
                return yLinearScale;
            }
                // define x and y Linear scale
            var xLinearScale = xScale(data, chosenXAxis2);
            var yLinearScale = yScale(data, chosenYAxis2);

            //Step3: Create axis functions
            //Create function to update xAxis upon click
            function renderXAxis(newXScale, xAxis2) {
                var bottomAxis = d3.axisBottom(newXScale);
                xAxis2.transition()
                    .duration(1000)
                    .call(bottomAxis);
                return xAxis2;
            }
            //Create function to update yAxis upon click
            function renderYAxis(newYScale, yAxis2) {
                var leftAxis = d3.axisLeft(newYScale);
                yAxis2.transition()
                    .duration(1000)
                    .call(leftAxis);
                return yAxis2;
            }
            // Create initial axis functions
            var bottomAxis = d3.axisBottom(xLinearScale);
            var leftAxis = d3.axisLeft(yLinearScale);

            //Step4:  Create function to update marker group with a transition
            //new markers
            function renderMarkers(markersGroup2, circles, texts, newXScale, chosenXAxis2, newYScale, chosenYAxis2) {
                
                circles.transition()
                    .duration(1000)
                    .attr("cx", d => newXScale(d[chosenXAxis2]))
                    .attr("cy", d => newYScale(d[chosenYAxis2]))

                texts.transition()
                    .duration(1000)
                    .attr("x", d => newXScale(d[chosenXAxis2]))
                    .attr("y", d => newYScale(d[chosenYAxis2]))
                
                return markersGroup2;
            }
            //function used to update markers group with new tooltip
        function updateToolTip2(chosenXAxis2, chosenYAxis2, markersGroup2) {
            //tip defined / intitialized at the top
            //invoke the tip in the context of the visualization
            markersGroup2.call(tip2)
            return markersGroup2;
        }

        //Step5:  Append Axes
            //Append x axis
        var xAxis2 = chartGroup2.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);
        
            // append y axis
        var yAxis2 = chartGroup2.append("g")
            .classed("y-axis", true)
            .call(leftAxis)
            
        
        //Step6: Transform a g element with the location of the data point
        var markersGroup2 = chartGroup2.append("g");
            
        //Step7: Add markers and text to the g element above
        var circles = markersGroup2.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis2]))
            .attr("cy", d => yLinearScale(d[chosenYAxis2]))
            .attr("r", 12)
            .attr("fill", "green")
            .attr("opacity", ".4")
            .on('mouseover', tip2.show)
            .on('mouseout', tip2.hide);

        var texts = markersGroup2.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("x", d => xLinearScale(d[chosenXAxis2]))
            .attr("y", d => yLinearScale(d[chosenYAxis2]))
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'central')
            .text(function(d) {return d.abbr});
        // Create group for 3 x-axis labels
        var xlabelsGroup = chartGroup2.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`);
        
        var populationLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "Population") // value to grab for event listener
            .classed("active", true)
            .text("Total State Population");

        var hincomeLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "HouseholdIncome") // value to grab for event listener
            .classed("inactive", true)
            .text("Household Income (Mean)");

        var pcincomeLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "PerCapitaIncome") // value to grab for event listener
            .classed("inactive", true)
            .text("Per Capita Income (Mean)");
        
        // // // Create group for 3 y-axis labels
        var ylabelsGroup = chartGroup2.append("g")
            
        var medicalLabel = ylabelsGroup.append("text")
            .attr("transform", "rotate(-90)")    
            .attr("y", -60)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .attr("value", "MedicalPercent") // value to grab for event listener
            .classed("active", true)
            .text("Medical Debt (%)");

        var studentLabel = ylabelsGroup.append("text")
            .attr("transform", "rotate(-90)")    
            .attr("y", -80)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .attr("value", "StudentDebtPercent") // value to grab for event listener
            .classed("inactive", true)
            .text("Student Debt (%)");

        var autoLabel = ylabelsGroup.append("text")
            .attr("transform", "rotate(-90)")    
            .attr("y", -100)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .attr("value", "AutoDebtPercent") // value to grab for event listener
            .classed("inactive", true)
            .text("Auto Debt (%)");

        //see updateToolTip function
        var markersGroup2 = updateToolTip2(chosenXAxis2, chosenYAxis2, markersGroup2); 

        // x axis labels event listener
        xlabelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis2) {

                // replaces chosenXAxis with value
                chosenXAxis2 = value;
                console.log(chosenXAxis2)

                // updates x scale for new data
                xLinearScale = xScale(data, chosenXAxis2);

                // updates x axis with transition
                xAxis2 = renderXAxis(xLinearScale, xAxis2);

                // updates markers with new x values
                markersGroup2 = renderMarkers(markersGroup2, circles, texts, xLinearScale, chosenXAxis2, yLinearScale, chosenYAxis2);

                // updates tooltips with new info
                markersGroup2 = updateToolTip2(chosenXAxis2, chosenYAxis2, markersGroup2);

                // changes classes to change bold text
                if (chosenXAxis2 === "Population") {
                    populationLabel
                    .classed("active", true)
                    .classed("inactive", false);
                    hincomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                    pcincomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                }
                else if (chosenXAxis2 === "HouseholdIncome") {
                    populationLabel
                    .classed("active", false)
                    .classed("inactive", true);
                    hincomeLabel
                    .classed("active", true)
                    .classed("inactive", false);
                    pcincomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                }
                else if (chosenXAxis2 === "PerCapitaIncome") {
                    populationLabel
                    .classed("active", false)
                    .classed("inactive", true);
                    hincomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                    pcincomeLabel
                    .classed("active", true)
                    .classed("inactive", false);
                }
            }
        });
        
        // y axis labels event listener
        ylabelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis2) {

                // replaces chosenXAxis with value
                chosenYAxis2 = value;
                console.log(chosenYAxis2)

                // updates x scale for new data
                yLinearScale = yScale(data, chosenYAxis2);

                // updates x axis with transition
                yAxis2 = renderYAxis(yLinearScale, yAxis2);

                // updates markers with new y values
                markersGroup2 = renderMarkers(markersGroup2,circles,texts, xLinearScale, chosenXAxis2, yLinearScale, chosenYAxis2);

                // updates tooltips with new info
                markersGroup2 = updateToolTip2(chosenXAxis2, chosenYAxis2, markersGroup2);

                // changes classes to change bold text
                if (chosenYAxis2 === "MedicalPercent") {
                    medicalLabel
                    .classed("active", true)
                    .classed("inactive", false);
                    studentLabel
                    .classed("active", false)
                    .classed("inactive", true);
                    autoLabel
                    .classed("active", false)
                    .classed("inactive", true);
                }
                else if (chosenYAxis2 === "StudentDebtPercent") {
                    medicalLabel
                    .classed("active", false)
                    .classed("inactive", false);
                    studentLabel
                    .classed("active", true)
                    .classed("inactive", false);
                    autoLabel
                    .classed("active", false)
                    .classed("inactive", true);
                }
                else if (chosenYAxis2 === "AutoDebtPercent") {
                    medicalLabel
                    .classed("active", false)
                    .classed("inactive", true);
                    studentLabel
                    .classed("active", false)
                    .classed("inactive", true);
                    autoLabel
                    .classed("active", true)
                    .classed("inactive", false);
                }
            }
        });

    
    
});
