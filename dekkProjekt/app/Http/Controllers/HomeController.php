<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    // default page (index)
    public function home()
    {
        return view("map_leaflet");
    }

    // loads data from database
    public function load($dataset1, $dataset2)
    {
        $ret = DB::table('data')
        ->select('hodnota', 'okres')
        ->where('dataset_id', '=', $dataset1)
        ->orWhere('dataset_id', '=', $dataset2)
        ->get();
        
        // var_dump($ret);

        return $ret;
    }
}
