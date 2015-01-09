#!/bin/bash
#GSN WP Client (worker) Setup
#Version 1.0.0

echo "************"
echo "************ nfs requirements"
apt-get install nfs-common

echo "************"
echo "************ create a directory for the shared data"
mkdir -p /mnt/nfs/wordpress

echo "************"
echo "************ mount the shared filesystem"
mount admin.prodwp.gsn2.com:/mnt/sharefs/wordpress /mnt/nfs/wordpress 

# set automatic mounting in case of reboot
#sed -i -e "s/admin.prodwp.gsn2.com:\/mnt\/sharefs\/wordpress/\/mnt\/nfs\/wordpress   nfs auto,noatime,nolock,bg,nfsvers=4,sec=krb5p,intr,tcp,actimeo=1800 0 0/g" /etc/fstab

echo "************"
echo "************ point the document root at the nfs folder"
sed -i -e "s/\/usr\/share\/nginx\/html/\/mnt\/nfs\/wordpress/g" /etc/nginx/sites-available/default

echo "************"
echo "************ add index.php to the list of possibles"
sed -i -e "s/index.html index.htm/index.php/g" /etc/nginx/sites-available/default

echo "************"
echo "************ add php section"
sed -i -e "s/# pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000/location ~ \\\.php$ {fastcgi_split_path_info ^(.+\\\.php)(\/.+)$;fastcgi_pass unix:\/var\/run\/php5-fpm.sock;fastcgi_index index.php;include fastcgi_params;}/g" /etc/nginx/sites-available/default

echo "************"
echo "************ add proxy to admin"
sed -i -e "s/#location \/RequestDenied {/location \/wp-admin {proxy_pass http:\/\/admin.prodwp.gsn2.com;}/g" /etc/nginx/sites-available/default

echo "************"
echo "************ restart nginx"
service nginx reload


