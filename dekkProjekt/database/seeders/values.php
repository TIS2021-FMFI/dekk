<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class values extends Seeder
{
    function rand_float()
    {
        return mt_rand(0, 1000)/100;
    }

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $specific_year = DB::table('specific_year_datasets')
                        ->select('id')->get();
        $districts = DB::table('districts')
                    ->select('id')->get();

        foreach($specific_year as $s_y){
            foreach($districts as $district){
                DB::table('values')->insert([
                    'district_id' => $district->id,
                    'specific_dataset_id' => $s_y->id,
                    'value' => $this->rand_float()
                ]);
            }
        }

    }

}
