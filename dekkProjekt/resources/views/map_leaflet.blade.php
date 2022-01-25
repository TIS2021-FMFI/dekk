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


    <!-- Singleton module responsible for the graph functionality -->
    <script src="js/d3_graph_module.js"></script>

    <!-- Singleton module responsible for the map functionality -->
    <script src="js/leaflet_map_module.js"></script>


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

    <!-- Script for dropdown and parameters -->
    <script src="js/dropdown_and_params.js"></script>

    <!-- Leaflet pip(point in polygon) used to propagate mouse events to all layers of the map -->
    <script src='https://unpkg.com/@mapbox/leaflet-pip@latest/leaflet-pip.js'></script>

</head>

<body>
    <div class="container-fluid" style="height:100%">
        <div style="height:100%">
            <div class="row" id="main_row">

                <!-- class="subPanel" -->
                <div class="col-xl-3 col-lg-3 col-md-12" id="sidePanel1">

                    <h3>Datasety a parametre</h3>
                    <div class="datasets_parameters">

                        <div class="row" style="display:contents">
                            <!-- multichoice picker with search, limited to 2 selected options -->
                            <select class="selectpicker" id="selectpicker" multiple data-live-search="true"
                                data-max-options="2"
                                data-max-options-text="[&quot;MAX. 2 datasety!&quot;, &quot;MAX. 2 datasety!&quot;]"
                                title="Zoznam datasetov" style="background-color:#ed3833;" data-selected-text-format="static"
                                onchange="getSelectedDatasetsParams(); getYearsIntersectionForSelectedDatasets()"
                                onload="loadAllDataSetParams()">
                            </select>

                        </div>
                        <!-- dynamic datasets and params -->
                        <div id="selected_datasets" style="display:none">
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

                    <!-- Slider (value needed for year pick) -->
                    <div class="slidercontainer" style="margin-top: 1em;">
                        <h4 style="text-align:center; font-weight:bold">Rok: <span id="sliderYear"></span></h4>
                        <input type="range" min="1990" max="2022" value="2021" class="slider" id="myRange">

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
                    <div id="control_buttons" class="row">

                        <!-- Send requested datasets -->
                        <button id="refreshButton" type="button" class="btn btn-dark"
                            onclick="sendParamsIDsAndYear(yearOutput.innerHTML)">Zobraziť</button>

                        <!-- clear button -->
                        <button id="clearButton" type="button" class="btn btn-outline-danger"
                            onclick="clearPicked(); MapModule.clear(); GraphModule.clear();">Vymazať</button>

                    </div>
                </div>

                <!-- Map -->
                <div class="col-xl-6 col-lg-6 col-md-12" id="midPanel">
                    <div id='map'></div>
                </div>

                <div class="col-xl-3 col-lg-3 col-md-12" id="sidePanel2">
                    <!-- Graph -->
                    <div id="graph">
                        <h3>Graf korelácie SR</h3>
                    </div>
                    <div class="correlation_meaning">
                        <p id="correlation_definition"></p>
                    </div>
                    <div id="download_buttons">
                        <!-- Graph save button -->
                        <button id='saveButtonGraph' type="button" class="btn btn-dark">Stiahnuť graf</button>
                        <!-- Map save button -->
                        <button id='saveButtonMap' type="button" class="btn btn-dark">Stiahnuť mapu</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script type="text/javascript" src="js/okresy.js"></script>
    <script src="js/load_data.js"></script>

    <script type="text/javascript">
    MapModule.init();
    GraphModule.init();
    // width and height of the map
    save_to_img('map', '#saveButtonMap', 770, 720);
    // width and height of the graph
    save_to_img('graph', '#saveButtonGraph', 370, 360);
    </script>
    <script src="js/get_params.js"></script>

    <!-- height adjust -->
    <script>
    //console.log("HEIGHT: " + window.innerHeight);
    const main_row = document.getElementById("main_row");
    main_row.style.height = window.innerHeight + "px";
    //console.log("MAIN_ROW: " + main_row);
    </script>


</body>

</html>