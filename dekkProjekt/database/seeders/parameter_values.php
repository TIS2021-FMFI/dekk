<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class parameter_values extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('parameter_values')->insert([
            'name'=>'spolu',
            'parameter_id'=>'1',
        ]);

        DB::table('parameter_values')->insert([
            'name'=>'zena',
            'parameter_id'=>'2',
        ]);

        DB::table('parameter_values')->insert([
            'name'=>'muz',
            'parameter_id'=>'2',
        ]);

        DB::table('parameter_values')->insert([
            'name'=>'spolu',
            'parameter_id'=>'3',
        ]);

        DB::table('parameter_values')->insert([
            'name'=>'zakladna skola',
            'parameter_id'=>'4',
        ]);

        DB::table('parameter_values')->insert([
            'name'=>'stredna skola',
            'parameter_id'=>'4',
        ]);

        DB::table('parameter_values')->insert([
            'name'=>'vysoka skola',
            'parameter_id'=>'4',
        ]);
    }
}
