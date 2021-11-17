
function basic_with_tooltips() {
    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 460 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#my_dataviz2")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            `translate(${margin.left}, ${margin.top})`);

    //Read the data
    d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv").then( function(data) {

    // Add X axis
    const x = d3.scaleLinear()
        .domain([0, 3000])
        .range([ 0, width ]);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, 400000])
        .range([ height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
    // Its opacity is set to 0: we don't see it by default.
    const tooltip = d3.select("#my_dataviz2")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")



    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    const mouseover = function(event, d) {
        tooltip
        .style("opacity", 1)
    }

    const mousemove = function(event, d) {
        console.log("mouseover event x = " + event.x)
        console.log("mouseover event y = " + event.y)
        console.log("mouseover d3 = " + d3.pointer(event, svg.append("g").node()))
        const coords = d3.pointer(event, svg.append("g").node())
        tooltip
        .html(`The exact value of<br>the Ground Living area is: ${d.GrLivArea}`)
        .style("left", (coords[0]) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
        .style("top", (coords[1]+850) + "px")
    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    const mouseleave = function(event,d) {
        tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
    }

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(data.filter(function(d,i){return i<50})) // the .filter part is just to keep a few dots on the chart, not all of them
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.GrLivArea); } )
        .attr("cy", function (d) { return y(d.SalePrice); } )
        .attr("r", 7)
        .style("fill", "#69b3a2")
        .style("opacity", 0.3)
        .style("stroke", "white")
        .on("mouseover", mouseover )
        .on("mousemove", mousemove )
        .on("mouseleave", mouseleave )

    })
}

function basic() {
    d3.selectAll("h1").style("color", "green")
    

    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 30, left: 60},
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;
        
    // append the svg object to the body of the page
    const svg = d3.select("#my_dataviz1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    //Read the data
    d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv").then( function(data) {

        // Add X axis
        const x = d3.scaleLinear()
        .domain([0, 4000])
        .range([ 0, width ]);
        svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

        // Add Y axis
        const y = d3.scaleLinear()
        .domain([0, 500000])
        .range([ height, 0]);
        svg.append("g")
        .call(d3.axisLeft(y));

        // Add dots
        svg.append('g')
        .selectAll("dot")
        .data(data)
        .join("circle")
            .attr("cx", function (d) { return x(d.GrLivArea); } )
            .attr("cy", function (d) { return y(d.SalePrice); } )
            .attr("r", 1.5)
            .style("fill", "#69b3a2")
    })
}

function interactive_grouped() {
    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#my_dataviz3")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
            `translate(${margin.left}, ${margin.top})`);

    //Read the data
    d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv").then( function(data) {

    // Add X axis
    const x = d3.scaleLinear()
        .domain([4, 8])
        .range([ 0, width ]);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, 9])
        .range([ height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Color scale: give me a specie name, I return a color
    const color = d3.scaleOrdinal()
        .domain(["setosa", "versicolor", "virginica" ])
        .range([ "#440154ff", "#21908dff", "#fde725ff"])


    // Highlight the specie that is hovered
    const highlight = function(event,d){

        selected_specie = d.Species

        d3.selectAll(".dot")
        .transition()
        .duration(200)
        .style("fill", "lightgrey")
        .attr("r", 3)

        d3.selectAll("." + selected_specie)
        .transition()
        .duration(200)
        .style("fill", color(selected_specie))
        .attr("r", 7)
    }

    // Highlight the specie that is hovered
    const doNotHighlight = function(event,d){
        d3.selectAll(".dot")
        .transition()
        .duration(200)
        .style("fill", d => color(d.Species))
        .attr("r", 5 )
    }

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", function (d) { return "dot " + d.Species } )
        .attr("cx", function (d) { return x(d.Sepal_Length); } )
        .attr("cy", function (d) { return y(d.Petal_Length); } )
        .attr("r", 5)
        .style("fill", function (d) { return color(d.Species) } )
        .on("mouseover", highlight)
        .on("mouseleave", doNotHighlight )

    })
}
