
const GraphModule = (() => {

    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 30, left: 60};
    const width = 460 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const init = () => {
        // append the svg object to the body of the page
        const svg = d3.select('#graph')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)

        // TODO display some placeholder while no graph is loaded

    };
        
    // returns x, y coordinates of the beginning and the end of the line
    const lineToCoords = (operands, start, end) => {
        // y = b + ax
        const f = (a, b, x) => {
            return b + a * x;
        };

        const b = parseFloat(operands[0]);
        const a = parseFloat(operands[1]);

        return [start, f(a, b, start), end, f(a, b, end)];
    };

    const resetGraph = () => {
        d3.select('#graph').select('svg').remove();
    };

    const printCorrelation = correlation => { 
        correlation = correlation.split(';')[0];

        let corrNum;
        let corrLink; 
        let corrType = correlation.split('(')[0];

        // Pearson returns (0.8660254037844388, 0.011724811003954602) 
        // Spearman returns SpearmanrResult(correlation=0.8660254037844388, pvalue=0.011724811003954599)
        
        if (corrType == 'SpearmanrResult') {
            corrNum = parseFloat(correlation.split('(')[1].split(',')[0].split('=')[1]).toFixed(3);
            corrType = 'Spearman'
            corrLink = 'https://en.wikipedia.org/wiki/Spearman%27s_rank_correlation_coefficient'
        } else { // pearson
            corrNum = parseFloat(correlation.split(',')[0]).toFixed(3);
            corrType = 'Pearson'
            corrLink = 'https://en.wikipedia.org/wiki/Pearson_correlation_coefficient'
        }

        let corrStrength;
        const r = Math.abs(corrNum);
        switch(true) {
            case (r < 0.3):
                corrStrength = 'zanedbateľnú';
                break;
            case (r < 0.5):
                corrStrength = 'slabú';
                break;
            case (r < 0.7):
                corrStrength = 'priemernú';
                break;
            default:
                corrStrength = 'silnú';
        }

        if (corrNum < 0) corrStrength += ' negatívnu';

        document.getElementById('correlation_definition').innerHTML = `
        Korelačný koeficient je ${corrNum}. Koeficient bol vypočítaný pomocou <a class="red" href="${corrLink}" id="correlation_coefficient">${corrType}ovho vzorca.</a>
        <br>Jedná sa o ${corrStrength} koreláciu.
        `
    };
    
    const drawGraph = dataset => {

        if (typeof dataset == 'undefined') return;
    
        resetGraph();
        printCorrelation(dataset['corr']);
    
        const data = createDataArray(dataset);

        // max values for both axis are used to determine the scale
        const maxValueX = d3.max(Object.values(dataset['dataset1']));
        const maxValueY = d3.max(Object.values(dataset['dataset2']));
    
        // append the svg object to the body of the page
        const svg = d3.select('#graph')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
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
        const lineCoords = lineToCoords(dataset['corr'].split(';').slice(-2), 0, 1.05 * maxValueX);
    
        // plot linear regression line
        svg.append('line')
            .style('stroke', 'red')
            .style('stroke-width', 3)
            .style("stroke-dasharray", ("10, 3"))  
            .attr('x1', x(lineCoords[0]))
            .attr('y1', y(lineCoords[1]))
            .attr('x2', x(lineCoords[2]))
            .attr('y2', y(lineCoords[3]));
    
        // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
        const tooltip = d3.select('#graph')
            .append('div')
            .style('display', 'block')
            .style('opacity', 0)
            .attr('class', 'tooltip')
            .style('color', 'white')
            .style('background-color', 'grey')
            .style('border', 'solid')
            .style('border-width', '1px')
            .style('border-radius', '5px')
            .style('padding', '10px');
    
        // A function that change this tooltip when the user hover a point.
        // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
        const mouseover = (event, d) => {
            tooltip
            .style('display', 'block')
            .style('opacity', 1);
        };
    
        const mousemove = (event, d) => {
            const coords = d3.pointer(event, svg.append('g').node())
            tooltip
            .html(`Okres: ${d.name}<br>Hodnota 1: ${d.data1}<br>Hodnota 2: ${d.data2}`)
            .style('display', 'block') // in case of an overlap 
            .style('opacity', 1)
            .style('left', (coords[0]+100) + 'px')
            .style('top', (coords[1]) + 'px');
        };
    
        // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
        const mouseleave = (event, d) => {
            tooltip
            .transition()
            .duration(200)
            .style('display', 'none')
            .style('opacity', 0);
        };
        
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
            .on('mouseleave', mouseleave );
    };

    const createDataArray = dataset => {
        const data = []
    
        Object.keys(dataset.dataset1).forEach(function(key) {
            data.push({
                name: key,
                data1: parseFloat(dataset.dataset1[key]),
                data2: parseFloat(dataset.dataset2[key]) 
            })
        });
    
        return data;
    };

    return {
        init,
        drawGraph
    };

})();