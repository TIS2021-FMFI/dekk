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

    // loads dataset parameters from database
    public function load($dataset1, $dataset2)
    {
        $dataset_name1 = DB::table('dataset_types')
        ->where('id', $dataset1)
        ->value('name');

        $dataset_name2 = DB::table('dataset_types')
        ->where('id', $dataset2)
        ->value('name');

        $ret = array(
            $dataset_name1 => array(),
            $dataset_name2 => array()
        );

        $ret = $this->load_param($dataset_name1, $dataset1, $ret);
        $ret = $this->load_param($dataset_name2, $dataset2, $ret);

        return json_encode($ret);
    }

    public function load_param($dataset_name, $dataset_id, $ret)
    {

        $parameters = DB::table('parameters')
        ->select('id', 'name')
        ->where('dataset_type_id', '=', $dataset_id)
        ->get();

        $i = 0;
        foreach($parameters as $parameter) {

            array_push($ret[$dataset_name], array($parameter->name => array()));

            $values = DB::table('parameter_values')
            ->select('id', 'name')
            ->where('parameter_id', '=', $parameter->id)
            ->get();

            
            foreach($values as $value) {
                array_push($ret[$dataset_name][$i][$parameter->name], array($value->id, $value->name));
            }
            $i++;
        }

        return $ret;
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
