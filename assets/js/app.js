var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 35,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);



// Import Data

d3.csv("assets/data/data.csv").then(function(data) {

    

    data.forEach(function(data) {
      data.age = +data.age;
      data.smokes = +data.smokes;
      data.healthcare = +data.healthcare;
      data.income = +data.income;
      data.obesity = +data.obesity;
      data.poverty = +data.poverty;

    });

    console.log(data)


    //scale functions
    
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.age)*0.9, d3.max(data, d => d.age)*1.1])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.smokes) *0.9, d3.max(data, d => d.smokes) *1.1 ])
      .range([height, 0]);

   // set up axis

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

  
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create Circles

    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "13")
    .attr("fill", "lightblue");

    // create text

    var textGroup = chartGroup.selectAll('.stateText')
    .data(data)
    .enter()
    .append('text')
    .classed('stateText', true)
    .attr('x', d => xLinearScale(d.age))
    .attr('y', d => yLinearScale(d.smokes))
    .attr('dy', 3)
    .attr('font-size', '10px')
    .attr("font-weight", "bold")
    .text(d => d.abbr);
    
   
   

    // tool tip
 
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .html(function(d) {
        return (`${d.state}<br>Median Age: ${d.age}<br>Smokes: ${d.smokes}%`);
      });

  
    circlesGroup.call(toolTip);

  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    
      createAxes()
  
  });


function createAxes() {

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 50)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "YaxisText")
      .attr("font-weight", "bold")
      .attr("text-align", "center")
      .text("Smokes (%)");



    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
      .attr("class", "XaxisText")
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .text("Age (Median)");


    


}


