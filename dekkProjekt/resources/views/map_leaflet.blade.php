<!DOCTYPE html>
<html>

<head>
    <title>DEKK Projekt</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- load leaflet.js -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossorigin="" />
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
        integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
        crossorigin=""></script>

    <!-- other stylesheets -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="css/app.css" />

    <!-- Load d3.js -->
    <script src="https://d3js.org/d3.v6.js"></script>
    <script src="js/scripts.js"></script>

    <!-- The code uses small FileSaver.js library to save generated images and Canvas-to-Blob.js library to ensure browser compatibility. -->
    <script
        src="https://cdn.rawgit.com/eligrey/canvas-toBlob.js/f1a01896135ab378aa5c0118eadd81da55e698d8/canvas-toBlob.js">
    </script>
    <script src="https://cdn.rawgit.com/eligrey/FileSaver.js/e9d941381475b5df8b7d7691013401e171014e89/FileSaver.min.js">
    </script>

    <!-- Load save btn script -->
    <script src="js/save_btn.js"></script>

    <!-- For dropdown multiselect picklist with search (selectpicker) -->
    <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.13.1/css/bootstrap-select.css" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.13.1/js/bootstrap-select.min.js"></script>

    <!-- Color picker script -->
    <script src="js/iro.min.js"></script>

    <!--Checkboxes style -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pretty-checkbox@3.0/dist/pretty-checkbox.min.css" />

    <!-- Script for dropdown and parameters -->
    <script src="js/dropdown_and_params.js"></script>

</head>

<body>
    <div class="container-fluid" style="height:100%;">
        <div style="height:100%;">
            <div class="row" id="main_row">

                <!-- class="subPanel" -->
                <div class="col-xl-3 col-lg-12" id="sidePanel1">

                    <h3>Datasety a parametre</h3>
                    <div class="datasets_parameters">

                        <!-- multichoice picker with search, limited to 2 selected options -->
                        <select class="selectpicker" id="selectpicker" multiple data-live-search="true"
                            data-max-options="2"
                            data-max-options-text="[&quot;MAX. 2 datasety!&quot;, &quot;MAX. 2 datasety!&quot;]"
                            title="Datasety" style="background-color:#ed3833;" data-selected-text-format="static"
                            onchange="getSelectedDatasetsParams()" onload="loadAllDataSetParams()">
                        </select>

                        <!-- dynamic datasets and params -->
                        <div id="selected_datasets" style="display:none">
                            <div>

                                <!-- it's just the two datastes -->
                                <div id="selected_d_w_p">

                                    <!-- selected dataset -->
                                    <div class="selected_datasets" id="selected_dataset0"></div>
                                    <!-- selected datasets parameters -->
                                    <div id="selected_dataset_params0"></div>

                                    <div class="selected_datasets" id="selected_dataset1"></div>
                                    <div id="selected_dataset_params1"></div>

                                </div>

                            </div>
                        </div>
                    </div>

                    <!-- Slider (value needed for year pick) -->
                    <div class="slidercontainer" style="margin-top: 1em;">
                        <h3>Rok: <span id="sliderYear"></span></h3>
                        <input type="range" min="1990" max="2020" value="2020" class="slider" id="myRange">

                        <script>
                        var slider = document.getElementById("myRange");
                        var yearOutput = document.getElementById("sliderYear");
                        yearOutput.innerHTML = slider.value;
                        slider.oninput = function() {
                            yearOutput.innerHTML = this.value;
                            console.log(yearOutput.innerHTML);
                        }
                        </script>
                    </div>

                    <!-- Send requested datasets -->
                    <button type="button" class="btn btn-dark"
                        onclick="validateRequest(yearOutput.innerHTML)">Obnoviť</button>
                </div>

                <!-- Map -->
                <div class="col-xl-5 col-lg-12" id="midPanel">
                    <div id='map'></div>
                    <div class="row">

                        <!-- color pickers -->
                        <!--
                        <div class="col-xl-6 col-lg-6">
                            <div class="picker1" id="picker1">
                                <script>
                                var colorPicker1 = new iro.ColorPicker('#picker1', {
                                    width: 150,
                                    color: "#fff",
                                    layout: [{
                                        component: iro.ui.Wheel,
                                        options: {}
                                    }, ]
                                });
                                </script>
                            </div>
                        </div>

                        <div class="col-xl-6 col-lg-6">
                            <div class="picker2" id="picker2">
                                <script>
                                var colorPicker2 = new iro.ColorPicker('#picker2', {
                                    width: 150,
                                    color: "#fff",
                                    layout: [{
                                        component: iro.ui.Wheel,
                                        options: {}
                                    }, ]
                                });
                                </script>
                            </div>
                        </div>
                        -->

                        <!-- legenda farieb -->
                        <div class='my-legend'>
                            <div class='legend-title'>
                                <h4>Legenda farieb</h4>
                            </div>
                            <div class='legend-scale'>
                                <ul class='legend-labels'>
                                    <li><span style='background:#FFEDA0;'></span>Dataset 1</li>
                                    <li><span style='background:#a54c67;'></span>Dataset 2</li>
                                </ul>
                            </div>
                        </div>

                    </div>

                </div>

                <!-- BEFORE : <div class="col-md-4" id="odpoved"></div> -->
                <div class="col-xl-4 col-lg-12" id="sidePanel2">
                    <!-- Graph -->

                    <div id="my_dataviz3">
                        <h3>Graf korelácie</h3>
                    </div>
                    <div class="correlation_meaning">
                        <p>Korelačný koeficient je <a class="red"
                                href="https://sk.wikipedia.org/wiki/Korelácia_(štatistika)"> 0.64 </a> a hovorí
                            nám...
                        </p>
                    </div>




                    <!-- Graph save button -->
                    <button id='saveButtonGraph' type="button" class="btn btn-dark">Stiahnuť PNG grafu</button>
                    <!-- Map save button -->
                    <button id='saveButtonMap' type="button" class="btn btn-dark">Stiahnuť PNG mapy</button>



                </div>
            </div>
        </div>
    </div>

    <!--
    @foreach($dataset_types as $dataset_type)
    <div class="row">
        <div>
            <button type="button" class="btn btn-dark"
                onclick="getParams({{ $dataset_type->id }})">{{ $dataset_type->name }}</button>
        </div>
    </div>
    @endforeach
    -->

    <script type="text/javascript" src="js/okresy.js"></script>
    <script src="js/load_data.js"></script>


    <script type="text/javascript">
    // Leaflet map init
    let bounds = new L.LatLngBounds(new L.LatLng(50.16962074944367, 16.3865741126029432), new L.LatLng(
        46.94733587652772, 23.45591532167501));
    let map = L.map('map', {
        center: [48.6, 19.5],
        maxBounds: bounds,
        maxBoundsViscosity: 0.5
    }).setView([48.6, 19.5], 7);

    geojson = L.geoJson(okresy, {
        style: style
    }).addTo(map);

    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
        maxZoom: 11,
        minZoom: 7,
        id: 'tileset',
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    // D3 graph init
    interactive_grouped();

    // save btn init map width 970 heigth 600
    save_to_img('map', d3.select('#map').select("svg").node(), '#saveButtonMap', 970, 600)
    // save btn init graph width 370 height 360
    save_to_img('graph', d3.select("#my_dataviz3").select("svg").node(), '#saveButtonGraph', 370, 360);
    </script>

    <script src="js/get_params.js"></script>

    <!-- height adjust -->
    <script>
    console.log("HEIGHT: " + window.innerHeight);
    const main_row = document.getElementById("main_row");
    main_row.style.height = window.innerHeight + "px";
    console.log("MAIN_ROW: " + main_row);
    </script>


</body>

</html>