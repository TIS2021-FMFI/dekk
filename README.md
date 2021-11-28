# dekk
Studentsky projekt TIS 2021 - World  Value Survey

Project has 2 main parts:
- dekkProjekt -> web app, that uses laravel
- importScripts -> which lets admin user import data to database (run in terminal)

How to run app

php artisan serve

how to fill db:
create tables and data: php artisan migrate:fresh --seed
create data: php artisan migrate --seed

How to set up laravel

===set up from git===
INSTALLATION & SETUP

https://linoxide.com/how-to-install-laravel-on-ubuntu-20-04/?fbclid=IwAR0oFCWXlJ8a2UlBckUuDqk-kufF-w-mYMoJCZ0oViBDIHsS469NBLF2y1Q

run steps 1, 2 (no 3), 4, 5
instead of step 3 run: 
1. sudo apt install mysql-server
2. sudo mysql -u root

poznamka k 5.1 cd/var/ww/html - toto nerob
namiesto toho sprav cd Desktop alebo hocikam inam
vo var/ww/html musis donastovovat extra veci 

odporucam mat aj phpmyadmin:
phpmyadmin - https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-phpmyadmin-on-ubuntu-20-04?fbclid=IwAR1XjW2rgprXt9XY37qRrv69O5g25rOs1JpYLUFdaLCnGESF6QxoOtv4SPE


===set up from scratch===
for clean set up you need to create user and DB

!!!!ina DB!!!!
1. sudo apt install mysql-server
2. sudo mysql -u root
3. create user 
4. create DB


your app should be running on localhost:8000

# where is what
- laravel has many files and folders, here are the most important for us, in which or code will be:

-> app > Http > Controllers - here we define functions, which are called from routing based on frontend requests

-> database > migrations - place to define db scheme (create script)

-> database > seeders - 'generate script' put data in database

-> public > js - javascript scripts for frontend

-> resources > views > map_leaflet.blade.php - this is our html page

-> routes > web.php - routing, from URL it determines action - which controller and method to run as a response

-> .env - config file for configuring connection to db

-> .gitignore - file for files which you dont want to commit

# SETUP PROJECT ON WINDOWS IF YOU ALREADY HAVE XAMPP

Install composer(You can download composer from https://getcomposer.org/download/)<br />
Open cmd(make sure your path is the same as C:\xampp\htdocs>) then<br />
Install laravel GLOBALLY by the command: composer global require laravel/installer<br />
put a laravel project folder at htdocs(unzip if it's .zip file)<br />
In http://localhost/phpmyadmin/ create a database name 'datasets'<br />
Go to project root and find .env file and change DB_HOST=localhost, DB_USERNAME=root and set password empty DB_PASSWORD=<br />
Now run CMD (command line) go to project root directory and run php artisan cache:clear<br />
Next run php artisan migrate:install<br />
And now run php artisan serve<br />
Now you are good to go<br />
Go to localhost:8000<br />

