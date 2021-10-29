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
        $handle = fopen("/home/zuma/Desktop/dekk/dekkProjekt/okresy_data.txt", "r");
        if ($handle) {
            while (($line = fgets($handle)) !== false) {
                $data = explode(',', $line);
                DB::table('data')->insert([
                    'okres' => $data[0],
                    'hodnota'=> floatval($data[1]),
                    'dataset_id'=> 1,
                ]);
                
                // process the line read.
            }

            fclose($handle);
        } else {
            // error opening the file.
        }
        // \App\Models\User::factory(10)->create();
    }
}
