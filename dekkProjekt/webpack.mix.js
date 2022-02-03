const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js')
    .postCss('resources/css/app.css', 'public/css', [
        //
    ]);

mix.scripts(
    [
        'resources/js/d3_graph_module.js',
        'resources/js/dropdown_and_params.js',
        'resources/js/leaflet_map_module.js',
        'resources/js/load_data.js',
        'resources/js/okresy.js'
], 'public/js/main.js');