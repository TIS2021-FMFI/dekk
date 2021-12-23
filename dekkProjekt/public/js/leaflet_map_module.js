

// create singleton module for the map
const MapModule = (() => {

    const GeoJSON = (data, id, c1, c2) => {
        const dataset = id;
        const color1 = c1;
        const color2 = c2;
        const maxValue = d3.max(data['features'], o => o.properties.value);
        const datasetProperty = 'Value: '; // placeholder 
        const gradient = calculateColorGradient(color1, color2);

        const initializeInfoPane = () => {
            const pane = L.control();

            pane.onAdd = function (map) {
                this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
                this.update();
                return this._div;
            };
        
            // method that we will use to update the control based on feature properties passed
            pane.update = function (props) {
                if (map.hasLayer(geojson))
                    this._div.innerHTML = '<h4>' + dataset + '</h4>' +  (props ?
                        '<b>' + props.NM3 + '</b><br/>' + datasetProperty + props.value
                        : 'Nadíď kurzorom ponad okres');
            };
        
            return pane;
        };
        
        const initializeLegendPane = () => {
            const pane = L.control({position: 'bottomright'});

            pane.onAdd = function (map) {
                let x = Math.floor(maxValue / 6);
                let div = L.DomUtil.create('div', 'info legend'),
                    grades = [0, 1*x, 2*x, 3*x, 4*x, 5*x, 6*x, 7*x],
                    labels = [];
        
                // loop through our data intervals and generate a label with a colored square for each interval
                for (let i = 0; i < grades.length; i++) {
                    div.innerHTML +=
                        '<i style="background:' + getColor(grades[i] + 1, gradient, maxValue) + '"></i> ' +
                        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');

                }
        
                return div;
            };
        
            return pane;
        };

        const onEachFeature = (feature, layer) => {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
        };

        const geojson = L.geoJson(data, {
            style: feature => styling(feature, gradient, maxValue),
            onEachFeature: onEachFeature
        });
        const legend = initializeLegendPane();
        const info = initializeInfoPane();

        return {
            'getGeojson': () => geojson,
            'getInfo': () => info,
            'getLegend': () => legend,
            'reset': () => {
                info.remove();
                legend.remove();
                geojson.remove();
            },
            'debug': () => {
                console.log(`color1 = ${color1}`);
                console.log(`color2 = ${color2}`);
                console.log(`gradient = ${gradient}`);
                console.log(`maxValue = ${maxValue}`);
            }
        };
    };

    let geoLayer1;
    let geoLayer2;
    let selectOverlays;
    let map;

    const init = () => {
        const bounds = new L.LatLngBounds(new L.LatLng(50.16962074944367, 16.3865741126029432), new L.LatLng(46.94733587652772, 23.45591532167501));
        map = L.map('map', {
            center: [48.6, 19.5 ],
            maxBounds: bounds,
            maxBoundsViscosity: 0.5
        }).setView([48.6, 19.5 ], 7);
    
        const initialGeojson = L.geoJson(okresy, {
            style: feature => styling(feature, calculateColorGradient('0xfcfab3', '0xfcfab3'))
        }).addTo(map);
        
        L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
            maxZoom: 11,
            minZoom: 7,
            id: 'tileset',
            attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        }).addTo(map);
    };

    // creates and adds layers from geojson objects
    const addLayers = (dataset1, dataset2) => {

        if (typeof geoLayer1 != 'undefined' && typeof geoLayer2 != 'undefined') {
            geoLayer1.reset();
            geoLayer2.reset();
            selectOverlays.remove();
        }

        geoLayer1 = GeoJSON(dataset1, 'dataset1', '0xFFEDA0', '0x800026');
        geoLayer2 = GeoJSON(dataset2, 'dataset2', '0xffa600', '0x06415c');

        const overlay = {
            'dataset1': geoLayer1.getGeojson(),
            'dataset2': geoLayer2.getGeojson()
        };

        
        selectOverlays = L.control.layers(null, overlay, {collapsed: false, sortLayers: true});
        selectOverlays.addTo(map);

        // show/ hide legend and pane
        map.on('overlayadd', function(overlay) {
            if (overlay['name'] == 'dataset1') {
                geoLayer1.getInfo().addTo(map);
                geoLayer1.getLegend().addTo(map);

                // different overlay load orders result in different coloring of the map -> we dont want that
                // rearrange geojsons so that geoLayer2 is always on top resulting in consistent color palette

                if (map.hasLayer(geoLayer2.getGeojson())) {
                    geoLayer2.getGeojson().remove();
                    geoLayer2.getGeojson().addTo(map);
                }
            }
            if (overlay['name'] == 'dataset2') {
                geoLayer2.getInfo().addTo(map);
                geoLayer2.getLegend().addTo(map);
            }
        });

        map.on('overlayremove', function(overlay) {
            if (overlay['name'] == 'dataset1') {
                geoLayer1.getInfo().remove()
                geoLayer1.getLegend().remove()
            }
            if (overlay['name'] == 'dataset2') {
                geoLayer2.getInfo().remove()
                geoLayer2.getLegend().remove()
            }
        });
    };

    const styling = (feature, gradient, maxValue=0) => {
        return {
            weight: 2,
            opacity: 1,
            color: '#007472',
            fillOpacity: 0.5,
            fillColor: getColor(feature.properties.value, gradient, maxValue)
        };
    };

    const getColor = (d, gradient, maxValue) => {
        const x = Math.floor(maxValue / 7); // colors are evenly split between 0 and maxValue

        return  d > 7*x ? gradient[7] :
                d > 6*x ? gradient[6] :
                d > 5*x ? gradient[5] :
                d > 4*x ? gradient[4] :
                d > 3*x ? gradient[3] :
                d > 2*x ? gradient[2] :
                d > 1*x ? gradient[1] :
                          gradient[0];
    };

    // calculates color gradient between two hex colors
    const calculateColorGradient = (color1, color2) => {
        // get rgb from hex
        const getRgb = color => {
            const bigint = parseInt(color, 16),
                r = (bigint >> 16) & 255,
                g = (bigint >> 8) & 255,
                b = bigint & 255;

            return [r, g, b];
        };

        // get d% color between a1 and a2
        const getPoint = (d, a1, a2) => a1.map((p, i) => Math.floor(a1[i] + d * (a2[i] - a1[i])));
        const componentToHex = c => {
            const hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        };
          
        const rgbToHex = (r, g, b) => {
            return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
        };
        
        const rgb1 = getRgb(color1);
        const rgb2 = getRgb(color2);

        let colors = [];

        for (let i = 0, percent = 0; i < 8; i++, percent += 1/8) {
            colors.push(getPoint(percent, rgb1, rgb2))
        }

        colors = colors.map(c => rgbToHex(c[0], c[1], c[2]));
        return colors;
    };

    const highlightFeature = e => {
        let layer = e.target;

        layer.setStyle({
            weight: 4,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
    
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }

        let layers = leafletPip.pointInLayer(e.latlng, geoLayer1.getGeojson()).concat(leafletPip.pointInLayer(e.latlng, geoLayer2.getGeojson()));
    
        if (layers.length == 2) {
            if (map.hasLayer(geoLayer1.getGeojson())) geoLayer1.getInfo().update(layers[0].feature.properties);
            if (map.hasLayer(geoLayer2.getGeojson())) geoLayer2.getInfo().update(layers[1].feature.properties);
        }
    };

    const resetHighlight = e => {
        if (map.hasLayer(geoLayer1.getGeojson())) {
            geoLayer1.getGeojson().resetStyle(e.target);
            geoLayer1.getInfo().update();
        }
        if (map.hasLayer(geoLayer2.getGeojson())) {
            geoLayer2.getGeojson().resetStyle(e.target);
            geoLayer2.getInfo().update();
        }
    };

    const zoomToFeature = e => {
        map.fitBounds(e.target.getBounds());
    };

    return {
        init,
        addLayers,
        calculateColorGradient
    };

})();
