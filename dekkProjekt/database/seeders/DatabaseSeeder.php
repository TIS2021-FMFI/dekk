<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {

        $this->call([
            dataset_types::class,
            districts::class,
            parameters::class,
            parameter_values::class,
            specific_year_datasets::class,
            values::class,
            belongs::class
        ]);
        
    }
}
