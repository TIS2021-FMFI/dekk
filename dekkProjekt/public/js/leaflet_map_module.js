
// create singleton module for the map
const MapModule = (() => {

    const COLORS = [['0xe0dbfc', '0x1b183a'], ['0xe1d4d4', '0x771411']]
    const COLORS_DEFAULT = ['0x908bb6', '0x908bb6'];

    const GeoJSON = (data, id, c1, c2) => {
        const dataset = id;
        const color1 = c1;
        const color2 = c2;
        const maxValue = d3.max(data['features'], o => o.properties.value);
        const datasetProperty = 'Hodnota: ';
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
                const x = maxValue >= 10 ? Math.floor(maxValue / 7) : maxValue / 7; // colors are evenly split between 0 and maxValue
                console.log('x: ' + x);

                const div = L.DomUtil.create('div', 'info legend'),
                    grades = [0, 1*x, 2*x, 3*x, 4*x, 5*x, 6*x, 6.5*x],
                    labels = [];
                    console.log(grades);
        
                // loop through our data intervals and generate a label with a colored square for each interval
                for (let i = 0; i < grades.length; i++) {
                    let grade1 = maxValue > 10 ? grades[i] : grades[i].toFixed(1);
                    let grade2;
                    if (grades[i + 1]) grade2 = maxValue > 10 ? grades[i + 1] : grades[i + 1].toFixed(1);
                
                    div.innerHTML +=
                        '<i style="background:' + getColor(grades[i], gradient, maxValue) + '"></i> ' +
                        grade1 + (grades[i + 1] ? '&ndash;' + grade2 + '<br>' : '+');
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
            },
            'getDatasetName': () => dataset
        };
    };

    const geoLayers = [];
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
            style: feature => styling(feature, calculateColorGradient(COLORS_DEFAULT[0], COLORS_DEFAULT[1]))
        }).addTo(map);
        
        // http://leaflet-extras.github.io/leaflet-providers/preview/
        L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
            maxZoom: 11,
            minZoom: 7,
            id: 'tileset',
            attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        }).addTo(map);  
        
    };

    // creates and adds layers from geojson objects
    const addLayers = (...datasets) => {
        
        if (typeof geoLayers[0] != 'undefined') {
            geoLayers.forEach(layer => layer.reset());
            selectOverlays.remove();

            while (geoLayers.length != 0) {
                geoLayers.pop();
            }
        }

        const overlay = {};
        
        // this is where different colors are be assigned -> each GeoJSON object needs 2 colors for which a color gradient will be calculated upon construction
        datasets.forEach((dataset, i) => {
            // if colors are not assigned select default color scheme
            let color1 = COLORS_DEFAULT[0];
            let color2 = COLORS_DEFAULT[1];
            if (i < COLORS.length) {
                [color1, color2] = COLORS[i];
            }

            const geoLayer = GeoJSON(dataset, dataset['datasetName'], color1, color2);
            geoLayers.push(geoLayer);
            overlay[dataset['datasetName']] = geoLayer.getGeojson();
        })

        selectOverlays = L.control.layers(null, overlay, {collapsed: false, sortLayers: true});
        selectOverlays.addTo(map);

        geoLayers.forEach(layer => {
            layer.getGeojson().addTo(map);
            layer.getInfo().addTo(map);
            layer.getLegend().addTo(map);
            layer.getGeojson().bringToFront();
        })


        // show/ hide legend and pane
        map.on('overlayadd', overlay => {
            geoLayers.forEach(layer => {
                if (overlay['name'] == layer.getDatasetName()) {
                    layer.getInfo().addTo(map);
                    layer.getLegend().addTo(map);
                }

                // different overlay load orders result in different coloring of the map -> we dont want that
                // rearrange geojsons so that geoLayers are ordered by their initial order resulting in consistent color palette

                if (map.hasLayer(layer.getGeojson())) {
                    console.log('dataset name: ' + layer.getDatasetName());
                    layer.getGeojson().bringToFront();
                }
            })

        });

        map.on('overlayremove', function(overlay) {
            geoLayers.forEach(layer => {
                if (overlay['name'] == layer.getDatasetName()) {
                    layer.getInfo().remove()
                    layer.getLegend().remove()
                }

                if (map.hasLayer(layer.getGeojson())) {
                    layer.getGeojson().bringToFront();
                }
            })

        });
    };

    const styling = (feature, gradient, maxValue=0) => {
        return {
            weight: 1.2,
            opacity: 1,
            color: '#2f2963',
            fillOpacity: 0.5,
            fillColor: getColor(feature.properties.value, gradient, maxValue)
        };
    };

    const getColor = (d, gradient, maxValue) => {
        const x = maxValue >= 10 ? Math.floor(maxValue / 7) : maxValue / 7; // colors are evenly split between 0 and maxValue
        console.log('getColor x: ' + x);
        console.log('getColor d: ' + d);

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
            weight: 2.4,
            color: '#2f2963',
            dashArray: '',
            fillOpacity: 0.7
        });
    
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }

        geoLayers.forEach(layer => {
            if (map.hasLayer(layer.getGeojson())) {
                const district = leafletPip.pointInLayer(e.latlng, layer.getGeojson());
                if (typeof district[0] != 'undefined') layer.getInfo().update(district[0].feature.properties);
            }
        })
    };

    const resetHighlight = e => {
        geoLayers.forEach(layer => {
            if (map.hasLayer(layer.getGeojson())) {
                layer.getGeojson().resetStyle(e.target);
                layer.getInfo().update();
            }
        });
    };

    const zoomToFeature = e => {
        map.fitBounds(e.target.getBounds());
    };

    const clear = () => {
        if (geoLayers.length > 0) selectOverlays.remove();

        geoLayers.forEach(layer => {
            layer.reset();
        })

        while (geoLayers.length != 0) {
            geoLayers.pop();
        }
    };
      
    return {
        init,
        addLayers,
        calculateColorGradient,
        clear
    };

})();


function setupLegend(){
    const elements = document.getElementsByClassName("leaflet-control-attribution leaflet-control");
    elements[0].parentNode.style = "display: flex !important;"
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}