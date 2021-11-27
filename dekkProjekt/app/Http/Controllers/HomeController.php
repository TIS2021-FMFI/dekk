<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    // default page (index)
    public function home()
    {
        $dataset_types = DB::table('dataset_types')
        ->select('id', 'name')
        ->get();

        return view("map_leaflet")
        ->with('dataset_types', $dataset_types);
    }

    // loads data from database
    public function load($dataset1, $dataset2)
    {
        // $ret = DB::table('data')
        // ->select('hodnota', 'okres')
        // ->where('dataset_id', '=', $dataset1)
        // ->orWhere('dataset_id', '=', $dataset2)
        // ->get();
        
        // // var_dump($ret);

        // return $ret;
        return 1;
    }

    public function get_dataset_parameters($dataset_id)
    {
        $params = DB::table('parameters')
        ->select('name')
        ->where('dataset_type_id', '=', $dataset_id)
        ->get()
        ->toJson();

        return $params;
    }
}
