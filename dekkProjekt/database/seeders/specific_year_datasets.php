<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class specific_year_datasets extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(){
        for ( $i=0; $i<7; $i++){
            DB::table('specific_year_datasets')->insert([
                'year' => 2020,
            ]);

            DB::table('specific_year_datasets')->insert([
                'year' => 2019,
            ]);
        }
    }
}
