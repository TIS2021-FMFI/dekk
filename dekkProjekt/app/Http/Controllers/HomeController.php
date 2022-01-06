<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    // default page (index)
    public function home()
    {
        $dataset_types = DB::table('dataset_types')
        ->select('id', 'name')
        ->get();

        // error_log(json_encode(self::getAllDatasetsParams()));
        // foreach(self::getAllDatasetsParams() as $dat){
        //     error_log(json_encode($dat));
        // }
        error_log(self::get_specific_dataset_id([3], 2020));
        
        return view("map_leaflet")
        ->with('dataset_types', $dataset_types);
    }

    public static function getAllDatasetsParams(){
        error_log('som tu 1');
        $dataset_and_params = [];

        $dataset_types = DB::table('dataset_types')
        ->select('id', 'name')
        ->get();

        foreach($dataset_types as $type) {
            $dataset_and_params[$type->name] = self::load_parameter($type->id);
            $dataset_and_params[$type->name]['years'] = self::load_years($type->id);
            // error_log(json_encode($dataset_and_params[$type->name]));
        }
        return $dataset_and_params;
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
        ->join('districts', 'districts.id', '=', 'values.district_id')
        ->select('value', 'name')
        ->where('values.specific_dataset_id', '=', $specific_year_dataset_id)
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
        $dataset1 = self::get_values(1);
        $dataset2 = self::get_values(13);
        
        $res = self::calculate_correlation(self::extract_data($dataset1), self::extract_data($dataset2));
        $pom1 = [];
        foreach ($dataset1 as $dat) {
            $pom1[$dat->name] = $dat->value;
        }
        $dataset1 = $pom1;
        foreach ($dataset2 as $dat) {
            $pom1[$dat->name] = $dat->value;
        }
        $dataset2 = $pom1;

        $result = ['corr'=> $res, 'dataset1' => $dataset1, 'dataset2' => $dataset2];
        return json_encode($result);
    }
        
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

    public static function load_parameter($dataset_type_id)
    {
        $ret = [];

        $parameters = DB::table('parameters')
        ->select('name', 'id')
        ->where('dataset_type_id', '=', $dataset_type_id)
        ->get();

        foreach( $parameters as $parameter) {
            $ret[$parameter->name] = array(); 
            
            $values = DB::table('parameter_values')
            ->select('id', 'name')
            ->where('parameter_id', '=', $parameter->id)
            ->get();

            $pom = [];
            foreach($values as $val){
                $pom[$val->id] = $val->name;
            }
            
            $ret[$parameter->name] = $pom;
        }
        return $ret;
    }

    public static function load_years($dataset_type_id){
        $years = DB::table('parameters')
        ->join('parameter_values', 'parameter_values.parameter_id', 'parameters.id')
        ->join('belongs', 'parameter_values.id', 'belongs.parameter_value_id')
        ->join('specific_year_datasets', 'specific_year_datasets.id', 'belongs.specific_dataset_id')
        ->select('year')
        ->groupBy('year')
        ->where('parameters.dataset_type_id', '=', $dataset_type_id)
        ->get();
        // error_log($years);
        return $years->pluck('year')->all();
    }

    // public function load_params($dataset_type_id1, $dataset_type_id2){
    //     $data_par1 = self::load_parameter($dataset_type_id1);
    //     $data_par2 = self::load_parameter($dataset_type_id2);

    //     $ret = array(
    //         $dataset_type_id1 => $data_par1,
    //         $dataset_type_id2 => $data_par2
    //     );
    //     return json_encode($ret);
    // }

    public function get_specific_dataset_id($parameter_ids, $year){
        $specific_dataset_id = DB::table('belongs')
        ->join('specific_year_datasets', 'specific_year_datasets.id', 'belongs.specific_dataset_id')
        ->select('specific_dataset_id')
        ->where('year', '=', $year)
        ->where('parameter_value_id', '=', $parameter_ids[0])
        ->get()
        ->pluck('specific_dataset_id')
        ->toArray();

        foreach($parameter_ids as $parameter_id){
            $specific_dataset_id = DB::table('belongs')
            ->select('specific_dataset_id')
            ->where('parameter_value_id', '=', $parameter_id)
            ->get()
            ->pluck('specific_dataset_id')
            ->intersect($specific_dataset_id)
            ;
        }
        error_log($specific_dataset_id);
        $other = DB::table('belongs')
        ->join('specific_year_datasets', 'specific_year_datasets.id', 'belongs.specific_dataset_id')
        ->select('specific_dataset_id')
        ->where('year', '=', $year)
        ->whereNotIn('belongs.specific_dataset_id', $parameter_ids)
        ->get()
        ->pluck('specific_dataset_id');

        $specific_dataset_id = $specific_dataset_id->except($other);
        foreach($specific_dataset_id as $spec){
            error_log($spec);
            return $spec;
        }

        return "noooope";
    }

    // public function get_dataset_parameters($dataset_id)
    // {
    //     $params = DB::table('parameters')
    //     ->select('name')
    //     ->where('dataset_type_id', '=', $dataset_id)
    //     ->get()
    //     ->toJson();

    //     return $params;
    // }
}
?>