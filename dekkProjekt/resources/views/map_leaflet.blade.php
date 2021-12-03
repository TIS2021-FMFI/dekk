<!DOCTYPE html>
<html>
    <head>
        <title>DEKK Projekt</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <!-- load leaflet.js -->
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin="" />
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin=""></script>

        <!-- other stylesheets -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <link rel="stylesheet" href="css/app.css" />

        <!-- Load d3.js -->
        <script src="https://d3js.org/d3.v6.js"></script>
        <script src="js/scripts.js"></script>

        <!-- The code uses small FileSaver.js library to save generated images and Canvas-to-Blob.js library to ensure browser compatibility. -->
        <script src="https://cdn.rawgit.com/eligrey/canvas-toBlob.js/f1a01896135ab378aa5c0118eadd81da55e698d8/canvas-toBlob.js"></script>
        <script src="https://cdn.rawgit.com/eligrey/FileSaver.js/e9d941381475b5df8b7d7691013401e171014e89/FileSaver.min.js"></script>

        <!-- Load save btn script -->
        <script src="js/save_btn.js"></script>

        <!-- For dropdown multiselect picklist with search (selectpicker) -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.13.1/css/bootstrap-select.css" />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.bundle.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.13.1/js/bootstrap-select.min.js"></script>

    </head>

    <body>
        <div class="container-fluid">
            <div class="row">
                <div class="col-xl-3 col-lg-12" id="sidePanel">
                    <h3>Datasets & parameters:</h3>
                    <div class="datasets_parameters">

                        <!--
                        <select class="selectpicker" multiple data-live-search="true">
                            <?php for($i=1; $i<3; $i++) :?>
                                <option><?=$i?><label class="container" id="checkData<?=$i?>"></label></option>
                            <?php endfor;?>
                        </select>
                        -->
                        
                        <?php for($i=1; $i<3; $i++) :?>
                            <label class="container">
                                <input type="checkbox" id="checkData<?=$i?>"> checkData<?=$i?>
                            </label>
                        <?php endfor;?>

                    </div>

                    
                    <div class="slidecontainer">
                        <h3>Year: <span id="sliderYear"></span></h3>
                        <input type="range" min="1990" max="2020" value="2005" class="slider" id="myRange">
                    </div>

                    <script>
                        var slider = document.getElementById("myRange");
                        var output = document.getElementById("sliderYear");
                        output.innerHTML = slider.value;
                        slider.oninput = function() {
                            output.innerHTML = this.value;
                        }
                    </script>
                    <!-- Send requested datasets -->
                    <div class="align-self-end ml-auto">
                        <button type="button" class="btn btn-dark" onclick="sendRequest()">Reload</button>
                    </div>
                </div>

                <!-- Map -->
                <div class="col-xl-5 col-lg-12" id='map'></div>
        
                <!-- BEFORE : <div class="col-md-4" id="odpoved"></div> -->
                <div class="col-xl-4 col-lg-12" id="sidePanel">
                    <!-- Graph -->
                    <div id="my_dataviz3">
                        <h3>Interactive grouped demo</h3>
                    </div>
                    <div class="correlation_meaning">
                        <p>This correlation is strong and tells us...</p>
                    </div>
                    <!-- Graph save button -->
                    <div class="align-self-end ml-auto">
                        <button id='saveButton' type="button" class="btn btn-dark">Export graph to PNG</button>
                    </div>
                </div>
            </div>
        </div>


        
        @foreach($dataset_types as $dataset_type)
        <div class="row">
            <div>
                <button type="button" class="btn btn-dark"
                    onclick="getParams({{ $dataset_type->id }})">{{ $dataset_type->name }}</button>
            </div>
        </div>
        @endforeach
        


        <script type="text/javascript" src="js/okresy.js"></script>
        <script type="text/javascript">
            // Leaflet map init
            var map = L.map('map', { wheelPxPerZoomLevel: 200,
                zoomDelta: 0.25,
                zoomSnap: 0
            }).setView([48.7, 19.7], 7.5);
            geojson = L.geoJson(okresy).addTo(map);

            // D3 graph init
            interactive_grouped();

            // save btn init
            save_to_img();
        </script>
        <script src="js/load_data.js"></script>
        <script src="js/get_params.js"></script>
    </body>
</html>