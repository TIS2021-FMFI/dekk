<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class dataset_types extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        
        DB::table('dataset_types')->insert([
            'name' => 'oblubenost jednorozcov',
        ]);

        DB::table('dataset_types')->insert([
            'name' => 'pocet donasok jedla za rok',
        ]);
          
    }
}
