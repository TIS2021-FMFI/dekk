<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

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

    /* returns all datasets with their possible parameters and years */
    public static function getAllDatasetsParams(){
        $dataset_and_params = [];

        $dataset_types = DB::table('dataset_types')
        ->select('id', 'name')
        ->get();

        foreach($dataset_types as $type) {
            $dataset_and_params[$type->name] = self::load_parameter($type->id);
            $dataset_and_params[$type->name]['years'] = self::load_years($type->id);
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
        
        // change python3 to python if it isnt recognized
        $result = shell_exec("python3 " . public_path() . "/correlation.py " . escapeshellarg($input));
        
        return $result;
    }

    /*
        returns collection of district name with value, based on id of specific dataset 
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
        loads data from database, for each set of parameter values ids and year 
        returns correlation info, names of datasets and vales for each district in dataset
    */
    public function load($dataset1_par, $dataset2_par, $year)
    {
        $dataset1_par = explode("_", $dataset1_par);
        $dataset2_par = explode("_", $dataset2_par);
        
        $dataset1_name = self::get_dataset_name($dataset1_par[0]);
        $dataset2_name = self::get_dataset_name($dataset2_par[0]);

        
        $dataset1 = self::get_values(self::get_specific_dataset_id($dataset1_par, $year));
        $dataset2 = self::get_values(self::get_specific_dataset_id($dataset2_par, $year));
              
        $values1 = [];
        $values2 = [];
       
        foreach($dataset1 as $dat1){
            foreach($dataset2 as $dat2){
                if (strcmp($dat1->name, $dat2->name) == 0){
                    array_push($values1, $dat1->value);
                    array_push($values2, $dat2->value);
                }
            }
        }
        
        $res = self::calculate_correlation($values1, $values2); 
        
        $pom1 = [];
        foreach ($dataset1 as $dat) {
            $pom1[$dat->name] = $dat->value;
        }
        $dataset1 = $pom1;
        foreach ($dataset2 as $dat) {
            $pom1[$dat->name] = $dat->value;
        }
        $dataset2 = $pom1;

        $result = ['corr'=> $res, 'ds1' => $dataset1_name, 'ds2' => $dataset2_name,'dataset1' => $dataset1, 'dataset2' => $dataset2];
        return json_encode($result);
    }
        
    // loads dataset parameters from database
    // public function load2($dataset1, $dataset2)
    // {
    //     $dataset_name1 = DB::table('dataset_types')
    //     ->where('id', $dataset1)
    //     ->value('name');

    //     $dataset_name2 = DB::table('dataset_types')
    //     ->where('id', $dataset2)
    //     ->value('name');

    //     $ret = array(
    //         $dataset_name1 => array(),
    //         $dataset_name2 => array()
    //     );

    //     $ret = $this->load_param($dataset_name1, $dataset1, $ret);
    //     $ret = $this->load_param($dataset_name2, $dataset2, $ret);

    //     return json_encode($ret);
    // }

    /* 
       loads parameters with its values for dataset_type 
    */
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

    /* 
        returns dataset name based on parameter value id
    */
    public function get_dataset_name($par_val_id) {
        error_log($par_val_id);

        $name = DB::table('dataset_types')
        ->join('parameters', 'dataset_types.id', 'parameters.dataset_type_id')
        ->join('parameter_values', 'parameter_values.parameter_id', 'parameters.id')
        ->select('dataset_types.name')
        ->where('parameter_values.id', '=', $par_val_id)
        ->get();

        error_log($name[0]->name);

        return $name[0]->name;
    }
  
    /* 
        return array of years for dataset_type, for which there is data
    */
    public static function load_years($dataset_type_id){
        $years = DB::table('parameters')
        ->join('parameter_values', 'parameter_values.parameter_id', 'parameters.id')
        ->join('belongs', 'parameter_values.id', 'belongs.parameter_value_id')
        ->join('specific_year_datasets', 'specific_year_datasets.id', 'belongs.specific_dataset_id')
        ->select('year')
        ->groupBy('year')
        ->where('parameters.dataset_type_id', '=', $dataset_type_id)
        ->get();

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

    /*
        parameter_ids - array of parameters for chosen dataset
        year - year for which we want data
        return specific dataset id
     */
    public static function get_specific_dataset_id($parameter_ids, $year){
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

        $other = DB::table('belongs')
        ->join('specific_year_datasets', 'specific_year_datasets.id', 'belongs.specific_dataset_id')
        ->select('specific_dataset_id')
        ->where('year', '=', $year)
        ->whereNotIn('belongs.specific_dataset_id', $parameter_ids)
        ->get()
        ->pluck('specific_dataset_id');

        $specific_dataset_id = $specific_dataset_id->except($other);
        foreach($specific_dataset_id as $spec){
            // error_log($spec);
            return $spec;
        }
        //TODO: toto asi uplne nie
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

