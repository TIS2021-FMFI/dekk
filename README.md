# dekk
Studentsky projekt TIS 2021 - World  Value Survey

NEW - import scripts - for db communication
pip install mysql-connector-python 
pip install csv
pip install numpy
pip install scipy

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



Navod na nasadenie Laravelu do prostredia Ubuntu (AWS Lightsail)

1. Prihlasenie sa do SSH konzoly - Putty alebo webova konzola ktoru ponuka sluzba AWS  
 
2. Nainstalujeme Nginx (serverova technologia), update pociatocnych balickov  
  •	sudo apt-get update  
  •	sudo apt-get install nginx  
  
3. Instalacia PHP - Instancie AWS Lightsail maju predinstalovanu verziu 7.4  
  •	sudo apt-get update && sudo apt-get upgrade   
  •	sudo apt-get install software-properties-common  
  •	sudo add-apt-repository ppa:ondrej/php  
  •	sudo apt-get update  
  •	sudo apt-get install php7.3 php7.3-xml php7.3-gd php7.3-opcache php 7.3-mbstring  
  
4. Odstranenie Apache2   
Kedze pouzivame Nginx nepotrebujeme Apache2, ktory sa nainstaloval spolu s PHP  
  •	sudo apt-get purge apache2 apache2-utils apache2-bin apache2.2-common  
  
5. Instalacia MySQL  
  •	sudo apt-get install mysql-server  
  
6. Nasadenie Laravelu  
Instalacia Composer  
  •	curl -sS https://getcomposer.org/installer | php  
  •	mv composer.phar /usr/local/bin/composer  
Vytvorenie priecinka pre nas projekt  
  •	sudo mkdir /var/www/Laravel  
  •	sudo chown www-data:www-data /var/www/Laravel  
  •	chmod -R 775 /var/www/Laravel  
Do priecinka Laravel presunieme nas project (napr. pomocou Filezilla). Do priecinku www presunieme ImportScripts  

  
7. Nastavenie Nginx  
  •	sudo vim /etc/nginx/sites-available/default (alebo vymaz symlink default v sites-enabled a vytvor novy subor v sites-available a symlinkni ho do sites-enabled)  
``` 
server {  
	listen 80;  
	listen [::] 80;  
	root /var/www/laravel/public;  
	index index.php index.html index.htm index.nginx-debian.html  
  server_name slovenskovdatach.digital  
  
  location / {  
	  try_files $uri $uri/ /index.php?$query_string;  
  }  

  location ~ \.php$ {  
	  include snippets/fastcgi-php.conf;  
	  fastcgi_pass unix:/run/php/phpX.X-fpm.sock; // zmen X.X na verziu php  
  }  
}
```   
  
  •	sudo service nginx restart  

8. Vytvorenie pouzivatela v database MySQL  
  •	sudo mysql -u root -p  
  •	CREATE USER ‘dekk_project’@’localhost’ INDENTIFIED BY ‘2810pRojecT’;  
  •	FLUSH PRIVILEGES;  
  •	GRANT SELECT ON * . * TO ‘dekk_project’@’localhost’;  
  •	CREATE DATABASE datasets;  
  •	GRANT ALL PRIVILEGES ON ‘datasets’ . * TO ‘dekk_project’@localhost’;  
  •	FLUSH PRIVILEGES;  
9. Instalacia dependencies    
  •	sudo apt install python3-pip  
  •	pip install mysql-connector-python  
  •	pip install numpy  
  •	pip install scipy  



10. Instalacia python balickov pre pouzivatela www-data (vypocet korelacie)  
  •	sudo mkdir /var/www/.local  
  •	sudo mkdir/var/www/.cache  
  •	sudo chown www-data:www-data /var/www/.local  
  •	sudo chown www-data:www-data /var/www/.cache  
  •	sudo -H -u www-data pip install numpy  
  •	sudo -H -u www-data pip install scipy  






