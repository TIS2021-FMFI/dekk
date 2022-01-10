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
        $file_name = ['importScripts/volby.csv', 
            'importScripts/emise_km_tuhe.csv', 
            'importScripts/emisie_km_oxidsiricity.csv',
            'importScripts/emisie_tony_oxidsiricity.csv',
            'importScripts/emisie_tony_tuhe.csv',
            'importScripts/volby2020sas.csv',
            'importScripts/volby2020saspodiel.csv',
            'importScripts/volby2020sns.csv',
            'importScripts/volby2020snspodiel.csv',
            'importScripts/zivotanarodeni_poradie.csv',
            'importScripts/zivotanarodeni_poradie2.csv',
            'importScripts/zivotanarodeni_poradie3.csv',
            'importScripts/zivotanarodeni_poradie4.csv',
            'importScripts/zivotanarodeni_poradie5.csv'
        ];

        foreach($file_name as $file){
            error_log(shell_exec("python3 " . public_path() . "/../../importScripts/import_csv.py " . public_path() . "/../../" . $file));
        }
        
        return;
        
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
