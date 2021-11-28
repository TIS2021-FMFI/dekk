<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class belongs extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $specific_year = DB::table('specific_year_datasets')
                        ->select('id')->get();
        $param_values = DB::table('parameter_values')
                    ->select('id')->get();
        
        $i = 0;
        foreach($param_values as $pv){
            DB::table('belongs')->insert([
                'parameter_value_id' => $pv->id,
                'specific_dataset_id' => $specific_year[$i]->id,
            ]);

            $i++;
            DB::table('belongs')->insert([
                'parameter_value_id' => $pv->id,
                'specific_dataset_id' => $specific_year[$i]->id,
            ]);
            
            $i++;
        }
    }
}
