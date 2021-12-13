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

    /*
        $dataset1: array of numeric values
        $dataset2: array of numeric values

        calls python script to calculate correlation between $dataset1 and $dataset2
        and to find best linear function to approximate values (y = a + b*x)
        returns [correlation, a, b]
    */ 
    public static function calculate_correlation($dataset1, $dataset2){
        // transfer arrays into string to pass it to python script
        $input = implode(",",$dataset1) . ';' . implode(",", $dataset2);
        
        $result = shell_exec("python3 " . public_path() . "/correlation.py " . escapeshellarg($input));
        
        return $result;
    }

    /*
        returns collection of district_id with value, based on id of specific dataset 
    */
    public static function get_values($specific_year_dataset_id){
        $dataset = DB::table('values')
        ->select('value', 'district_id')
        ->where('specific_dataset_id', '=', $specific_year_dataset_id)
        ->orderBy('district_id')
        ->get();

        return $dataset;
    }

    /*
        from collection (district_id, value) extracts values
    */
    public static function extract_data($dataset){
        return $dataset->pluck('value')->all();
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
        
        $dataset1 = self::get_values(1);
        $dataset2 = self::get_values(13);
        
        $res = self::calculate_correlation(self::extract_data($dataset1), self::extract_data($dataset2));
        $result = ['corr'=> $res, 'dataset1' => $dataset1, 'dataset2' => $dataset2];
        return json_encode($result);
        
    // loads dataset parameters from database
    public function load2($dataset1, $dataset2)
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
