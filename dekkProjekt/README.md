prikaz na vytvorenie potrebnej struktury databazy:
php artisan migrate:fresh

prikaz na vytvorenie struktury databazy a a nasypanie testovacich dat:
php artisan migrate:fresh --seed


# basic navigation
- laravel has many files and folders, here are the most important for us, in which or code will be:

-> app > Http > Controllers - here we define functions, which are called from routing based on frontend requests

-> database > migrations - place to define db scheme (create script)

-> database > seeders - 'generate script' put data in database

-> public > js - javascript scripts for frontend

-> resources > views > map_leaflet.blade.php - this is our html page

-> routes > web.php - routing, from URL it determines action - which controller and method to run as a response

-> .env - config file for configuring connection to db

-> .gitignore - file for files which you dont want to commit
