<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class districts extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $handle = fopen("database/seeders/okresy_data.txt", "r");
        if ($handle) {
            //read line by line
            while (($line = fgets($handle)) !== false) {
                DB::table('districts')->insert([
                    'name' => $line,
                ]);
            }

            fclose($handle);
        } else {
            error_log('file not found or could not open');
            // error opening the file.
        }
    }
}
