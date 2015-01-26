#!/bin/bash
#GSN WP Host (admin) Setup
#Version 1.0.0

#todo
#add a new user called 'deploy'

echo "************"
echo "************ nfs requirements"
apt-get install nfs-kernel-server

echo "************"
echo "************ create a file system and folder on the elastic block store volume (disk)"
mkfs -t ext4 /dev/xvdf

echo "************"
echo "************ create a mount point"
mkdir /mnt/sharefs

echo "************"
echo "************ mount the attached ebs to /wordpress"
mount /dev/xvdf /mnt/sharefs

mkdir /mnt/sharefs/wordpress
mkdir /mnt/sharefs/gsn-repo

echo "************"
echo "************ change the ownership of the wordpress folder"
chown www-data:www-data /mnt/sharefs/wordpress
chown www-data:www-data /mnt/sharefs/gsn-repo

echo "************"
echo "************ increase permissions"
find /mnt/sharefs/wordpress/ -type d -exec chmod 755 {} \;
find /mnt/sharefs/wordpress/ -type f -exec chmod 644 {} \;
chmod 777 /mnt/sharefs/wordpress

echo "************"
echo "************ give permission to access the drive to the worker(s) -fails??"
echo "" &> /etc/exports
echo "/mnt/sharefs *.prodwp.gsn2.com(rw,sync,no_subtree_check)" >> /etc/exports
#echo "/mnt/sharefs 10.0.0.0/255.255.255.0(rw,sync,no_subtree_check)" >> /etc/exports
echo "/mnt/sharefs 10.0.0.0/24(rw,sync,no_subtree_check)" >> /etc/exports

service nfs-kernel-server start

echo "************"
echo "************ change the nginx doc root to the shared filesystem"
sed -i -e "s/\/usr\/share\/nginx\/html/\/mnt\/sharefs\/wordpress/g" /etc/nginx/sites-available/default

echo "************"
echo "************ add index.php to the list of possibles"
sed -i -e "s/index.html index.htm/index.php/g" /etc/nginx/sites-available/default

echo "************"
echo "************ add php section"
sed -i -e "s/# pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000/location ~ \\\.php$ {fastcgi_split_path_info ^(.+\\\.php)(\/.+)$;fastcgi_pass unix:\/var\/run\/php5-fpm.sock;fastcgi_index index.php;include fastcgi_params;}/g" /etc/nginx/sites-available/default

echo "************"
echo "************ clone the gsn wp repo"
git clone --recursive https://github.com/cannontech/wp-skeleton.git /mnt/sharefs/gsn-repo/repo

echo "************"
echo "************ move the wordpress files"
mv /mnt/sharefs/gsn-repo/repo/wp/* /mnt/sharefs/wordpress
mv /mnt/sharefs/gsn-repo/repo/content/themes/* /mnt/sharefs/wordpress/wp-content/themes
mv /mnt/sharefs/gsn-repo/repo/content/plugins/* /mnt/sharefs/wordpress/wp-content/plugins

echo "************"
echo "************ move the scripts to the shared drive"
mkdir /mnt/sharefs/gsn-scripts
#mv /mnt/sharefs/gsn-scripts

echo "************"
echo "************ restart nginx"
service nginx reload