


function save_to_img(svgNode, btn, width, height) {
    // Set-up the export button
    // #saveButtonGraph
    // #saveButtonMap
    d3.select(btn).on('click', function(){

        // d3.select("#my_dataviz3").select("svg").node() graph
        // d3.select("svg").node() map
        let svgString = getSVGString(svgNode);
        svgString2Image( svgString, 2*width, 2*height, 'png', save ); // passes Blob and filesize String to the callback

        function save( dataBlob, filesize ){
            saveAs( dataBlob, 'D3 vis exported to PNG.png' ); // FileSaver.js function
        }
    });

    // Below are the functions that handle actual exporting:
    // getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
    function getSVGString( svgNode ) {

        function appendCSS( cssText, element ) {
            const styleElement = document.createElement("style");
            styleElement.setAttribute("type","text/css"); 
            styleElement.innerHTML = cssText;
            const refNode = element.hasChildNodes() ? element.children[0] : null;
            element.insertBefore( styleElement, refNode );
        }

        function getCSSStyles( parentElement ) {

            function contains(str,arr) { 
                    return arr.indexOf( str ) === -1 ? false : true;
            }

            const selectorTextArr = [];

            // Add Parent element Id and Classes to the list
            selectorTextArr.push( '#'+parentElement.id );
            for (let c = 0; c < parentElement.classList.length; c++)
                    if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
                        selectorTextArr.push( '.'+parentElement.classList[c] );

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
        }

        svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
        let cssStyleText = getCSSStyles( svgNode );
        appendCSS( cssStyleText, svgNode );

        const serializer = new XMLSerializer();
        let svgString = serializer.serializeToString(svgNode);
        svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
        svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

        return svgString;
        

    }


    function svgString2Image( svgString, width, height, form, callback ) {
        let format = form ? form : 'png';

        const imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL

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

}