<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class parameters extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('parameters')->insert([
            'name'=>'spolu',
            'dataset_type_id'=>'1',
        ]);

        DB::table('parameters')->insert([
            'name'=>'pohlavie',
            'dataset_type_id'=>'1',
        ]);

        DB::table('parameters')->insert([
            'name'=>'spolu',
            'dataset_type_id'=>'2',
        ]);

        DB::table('parameters')->insert([
            'name'=>'vzdelanie',
            'dataset_type_id'=>'2',
        ]);
    }
}
