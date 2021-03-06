
const GraphModule = (() => {

    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 45, left: 45};
    const width = 400- margin.left - margin.right;
    const height = 340 - margin.top - margin.bottom;

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
                corrStrength = 'zanedbate??n??';
                break;
            case (r < 0.5):
                corrStrength = 'slab??';
                break;
            case (r < 0.7):
                corrStrength = 'priemern??';
                break;
            default:
                corrStrength = 'siln??';
        }

        if (corrNum < 0) corrStrength += ' negat??vnu';

        document.getElementById('correlation_definition').innerHTML = 
        `Korela??n?? koeficient je ${corrNum}. Koeficient bol vypo????tan?? pomocou <a class="red" href="${corrLink}" id="correlation_coefficient">${corrType}ovho vzorca.</a>
        Jedn?? sa o ${corrStrength} korel??ciu.`
    };
    
    const drawGraph = dataset => {

        if (typeof dataset == 'undefined') return;
    
        resetGraph();
        printCorrelation(dataset['corr']);
    
        const data = createDataArray(dataset);

        // max values for both axis are used to determine the scale
        const maxValueX = d3.max(Object.values(dataset['dataset1']).map(value => parseFloat(value)));
        const maxValueY = d3.max(Object.values(dataset['dataset2']).map(value => parseFloat(value)));

        // append the svg object to the body of the page
        const svg = d3.select('#graph')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)

        // Add X axis
        const x = d3.scaleLinear()
            .domain([0, 1.05 * maxValueX])
            .range([ 0, width ]);

        const xAxisFormat = d3.axisBottom(x)
            .tickFormat((d, i) => {
                return d3.format('~s')(d);
            })
        const xAxis = svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(xAxisFormat);


        // add Y axis name
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left)
            .attr('x',0 - (height / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .text('Dataset B');

        // add X axis name
        svg.append('text')             
            .attr('transform', `translate(${width/2},${height+margin.top+25})`)
            .attr('dx', '1em')
            .style('text-anchor', 'middle')
            .text('Dataset A')
    
        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, 1.05 * maxValueY])
            .range([ height, 0]);

        const yAxisFormat = d3.axisLeft(y)
            .tickFormat((d, i) => {
                return d3.format('~s')(d);
            })
        const yAxis = svg.append('g')
            .call(yAxisFormat);

        // get coordinates for the linear regression line
        const lineCoords = lineToCoords(dataset['corr'].split(';').slice(-2), 0, 1.05 * maxValueX);


        // function that will be called on zoom event, updates both axis and positions of the dots and the line
        const updateChart = event => {
            // recover the new scale
            const newX = event.transform.rescaleX(x);
            const newY = event.transform.rescaleY(y);

            const newXAxisFormat = d3.axisBottom(newX)
                .tickFormat((d, i) => {
                    return d3.format('~s')(d);
                });
            const newYAxisFormat = d3.axisLeft(newY)
                .tickFormat((d, i) => {
                    return d3.format('~s')(d);
                })

            // update axis with these new boundaries
            xAxis.call(newXAxisFormat);
            yAxis.call(newYAxisFormat);

            // update circle position
            scatter
                .selectAll('circle')
                .attr('cx', d => newX(d.data1))
                .attr('cy', d => newY(d.data2));
            

            // get the new beginning and the end of the line -> infinite line
            // const newCoords = lineToCoords(dataset['corr'].split(';').slice(-2), newX.domain().at(0), newX.domain().at(-1))
            // get the new beginning and the end fo the line -> 60% longer than the X domain -> static
            const newCoords = lineToCoords(dataset['corr'].split(';').slice(-2), -0.3 * maxValueX, 1.3 * maxValueX); 
            // // update line position
            line
                .attr('x1', newX(newCoords[0]))
                .attr('y1', newY(newCoords[1]))
                .attr('x2', newX(newCoords[2]))
                .attr('y2', newY(newCoords[3]));


        }


        // Set the zoom and pan features: how much you can zoom, on which part, and what to do when there is a zoom
        const zoom = d3.zoom()
        .scaleExtent([.8, 10])  // This control how much you can unzoom (x0.8) and zoom (x10)
        .extent([[0, 0], [width, height]])
        .on('zoom', updateChart);

        // Add a clipPath: everything out of this area won't be drawn.
        const clip = svg.append('defs').append('SVG:clipPath')
            .attr('id', 'clip')
            .append('SVG:rect')
            .attr('width', width )
            .attr('height', height )
            .attr('x', 0)
            .attr('y', 0);
    
    
        // plot linear regression line
        const line = svg.append('line')
            .attr('clip-path', 'url(#clip)')
            .style('stroke', 'red')
            .style('stroke-width', 3)
            .style("stroke-dasharray", ("10, 3"))  
            .attr('x1', x(lineCoords[0]))
            .attr('y1', y(lineCoords[1]))
            .attr('x2', x(lineCoords[2]))
            .attr('y2', y(lineCoords[3]));
    
        // Add a tooltip div. Here I define the general feature of the tooltip: stuff that does not depend on the data point.
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
            .style('left', (coords[0]) + 'px')
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
        
        // Create scatter
        const scatter = svg.append('g')
            .attr('clip-path', 'url(#clip)');

        // Invisible rect covering the entire plot, recovering all mouse events
        svg.append('rect')
            .attr('width', width)
            .attr('height', height)
            .style('fill', "none")
            .style('pointer-events', 'all')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .lower() // lower moves the rect behind scatter dots so mouseover events still work if hovering over a dot
            .call(zoom);

        // Add individual dots
        scatter            
            .selectAll('dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', function (d) { return x(d.data1); } )
            .attr('cy', function (d) { return y(d.data2); } )
            .attr('r', 5)
            .style('fill', '#2f2963')
            .style('opacity', 0.5)
            .style('stroke', 'white')
            .on('mouseover', mouseover )
            .on('mousemove', mousemove )
            .on('mouseleave', mouseleave );
    };

    const createDataArray = dataset => {
        const data = []
    
        Object.keys(dataset.dataset1).forEach(key => {
            data.push({
                name: key,
                data1: parseFloat(dataset.dataset1[key]),
                data2: parseFloat(dataset.dataset2[key]) 
            })
        });
    
        return data;
    };

    const clear = () => {
        resetGraph();
        init();
    }

    // functions responsible for saving the graph

    // Below are the functions that handle actual exporting:
    // getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
    const getSVGString = svgNode => {

        const appendCSS = (cssText, element) => {
            const styleElement = document.createElement("style");
            styleElement.setAttribute("type","text/css"); 
            styleElement.innerHTML = cssText;
            const refNode = element.hasChildNodes() ? element.children[0] : null;
            element.insertBefore( styleElement, refNode );
        }

        const getCSSStyles = parentElement => {

            const contains = (str,arr) => { 
                return arr.indexOf( str ) === -1 ? false : true;
            }

            const selectorTextArr = [];

            // Add Parent element Id and Classes to the list
            selectorTextArr.push('#'+parentElement.id );
            for (let c = 0; c < parentElement.classList.length; c++)
                    if (!contains('.'+parentElement.classList[c], selectorTextArr) )
                        selectorTextArr.push('.'+parentElement.classList[c] );

            // Add Children element Ids and Classes to the list
            const nodes = parentElement.getElementsByTagName("*");
            for (let i = 0; i < nodes.length; i++) {
                const id = nodes[i].id;
                if ( !contains('#'+id, selectorTextArr) )
                    selectorTextArr.push( '#'+id );

                const classes = nodes[i].classList;
                for (let c = 0; c < classes.length; c++)
                    if ( !contains('.'+classes[c], selectorTextArr) )
                        selectorTextArr.push( '.'+classes[c] );
            }

            // Extract CSS Rules
            let extractedCSSText = "";
            for (let i = 0; i < document.styleSheets.length; i++) {
                const s = document.styleSheets[i];
                
                try {
                    if(!s.cssRules) continue;
                } catch( e ) {
                    if(e.name !== 'SecurityError') throw e; // for Firefox
                    continue;
                }

                const cssRules = s.cssRules;
                for (let r = 0; r < cssRules.length; r++) {
                    if ( contains( cssRules[r].selectorText, selectorTextArr ) )
                        extractedCSSText += cssRules[r].cssText;
                }
            }
            return extractedCSSText;
        } // end of getCSSStyles

        svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
        let cssStyleText = getCSSStyles( svgNode );
        appendCSS( cssStyleText, svgNode );

        const serializer = new XMLSerializer();
        let svgString = serializer.serializeToString(svgNode);
        svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
        svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

        return svgString;
        
    }


    const svgString2Image = (svgString, width, height, form, callback) => {
        let format = form ? form : 'png';

        const imgsrc = 'data:image/svg+xml;base64,'+ btoa(unescape(encodeURIComponent(svgString))); // Convert SVG string to data URL

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;

        const image = new Image();
        image.onload = function() {
            context.clearRect ( 0, 0, width, height );
            context.drawImage(image, 0, 0, width, height);

            canvas.toBlob( function(blob) {
                const filesize = Math.round( blob.length/1024 ) + ' KB';
                if ( callback ) callback( blob, filesize );
            });
        };

        image.src = imgsrc;
    }

    const save = (width, height) => {
        // Set-up the export button
        const save = (dataBlob, filesize) => {
            saveAs(dataBlob, 'graph.png' ); // FileSaver.js function
        }

        svgNode = d3.select('#graph').select('svg').node()

        let svgString = getSVGString(svgNode);
        svgString2Image(svgString, 2*width, 2*height, 'png', save); // passes Blob and filesize String to the callback
    }

    return {
        init,
        drawGraph,
        clear,
        save
    };

})();