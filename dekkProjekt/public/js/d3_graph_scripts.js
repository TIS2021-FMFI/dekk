

// returns x, y coordinates of the beginning and the end of the line
function lineToCoords(correlation, start, end) {
    // y = b + ax

    function f(a, b, x) {
        return b + a * x;
    }

    let tmp = correlation.split(';');
    let b = parseFloat(tmp[1]);
    let a = parseFloat(tmp[2]);

    return [start, f(a, b, start), end, f(a, b, end)];
}


function resetGraph() {
    // d3.select('#my_dataviz3').selectAll('g > *').remove();
    d3.select('#my_dataviz3').select('svg').remove();
}

function printCorrelation(correlation) { // TODO
    document.getElementById('correlation_coefficient').innerHTML = correlation.split(';')[0];
}

function createDataArray(dataset) {
    let data = []

    Object.keys(dataset.dataset1).forEach(function(key) {
        // console.log(key + ' ' + dataset.dataset1[key]);
        data.push({
            name: key,
            data1: parseFloat(dataset.dataset1[key]),
            data2: parseFloat(dataset.dataset2[key]) 
        })
    });

    return data;
}

function drawGraph(dataset) {

    if (typeof dataset == 'undefined') return;

    resetGraph();
    printCorrelation(dataset['corr']);

    let data = createDataArray(dataset);

    console.log(data);

    // max values for both axis are used to determine the scale
    const maxValueX = d3.max(Object.values(dataset['dataset1']));
    const maxValueY = d3.max(Object.values(dataset['dataset2']));

    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select('#my_dataviz3')
    .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
    .append('g')
        .attr('transform',
            `translate(${margin.left}, ${margin.top})`);

    // Add X axis
    const x = d3.scaleLinear()
        .domain([0, 1.05 * maxValueX])
        .range([ 0, width ]);
    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, 1.05 * maxValueY])
        .range([ height, 0]);
    svg.append('g')
        .call(d3.axisLeft(y));

    // get coordinates for the linear regression line
    let lineCoords = lineToCoords(dataset['corr'], 0, 1.1 * maxValueX);

    // plot linear regression line
    svg.append('line')
        .style('stroke', 'red')
        .style('stroke-width', 3)
        .style("stroke-dasharray", ("3, 3"))  
        .attr('x1', x(lineCoords[0]))
        .attr('y1', y(lineCoords[1]))
        .attr('x2', x(lineCoords[2]))
        .attr('y2', y(lineCoords[3]))


    // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
    // Its opacity is set to 0: we don't see it by default.
    const tooltip = d3.select('#my_dataviz3')
        .append('div')
        .style('display', 'block')
        .style('opacity', 1)
        .attr('class', 'tooltip')
        .style('background-color', 'grey')
        .style('border', 'solid')
        .style('border-width', '1px')
        .style('border-radius', '5px')
        .style('padding', '10px')



    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    const mouseover = function(event, d) {
        tooltip
        .style('display', 'block')
    }

    const mousemove = function(event, d) {
        // console.log('mouseover event x = ' + event.x)
        // console.log('mouseover event y = ' + event.y)
        console.log('mouseover d3 = ' + d3.pointer(event, svg.append('g').node()))
        const coords = d3.pointer(event, svg.append('g').node())
        tooltip
        .html(`The name of the <br>dataset value is: ${d.name}<br>data1: ${d.data1}<br>data2: ${d.data2}`)
        .style('display', 'block') // in case of an overlap 
        .style('left', (coords[0]+100) + 'px')
        .style('top', (coords[1]) + 'px')
    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    const mouseleave = function(event,d) {
        tooltip
        .transition()
        .duration(200)
        .style('display', 'none')
    }
    

    // Add dots
    svg.append('g')
        .selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', function (d) { return x(d.data1); } )
        .attr('cy', function (d) { return y(d.data2); } )
        .attr('r', 7)
        .style('fill', '#69b3a2')
        .style('opacity', 0.3)
        .style('stroke', 'white')
        .on('mouseover', mouseover )
        .on('mousemove', mousemove )
        .on('mouseleave', mouseleave )

}