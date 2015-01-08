#!/bin/bash
#GSN WP Host (admin) Setup
#Version 1.0.0

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

echo "************"
echo "************ change the ownership"
chown nobody:nogroup /mnt/sharefs/wordpress

echo "************"
echo "************ increase permissions"
chmod 777 /mnt
chmod 777 /mnt/sharefs
chmod 777 /mnt/sharefs/wordpress

echo "************"
echo "************ give permission to access the drive to the worker(s)"
echo "" &> /etc/exports
echo "/mnt/sharefs *.prodwp.gsn2.com(rw,sync,no_subtree_check)" >> /etc/exports
echo "/mnt/sharefs 10.0.0.0/255.255.255.0(rw,sync,no_subtree_check)" >> /etc/exports

service nfs-kernel-server start

echo "************"
echo "************ change the nginx doc root to the shared filesystem"
sed -i -e "s/\/usr\/share\/nginx\/html/\/mnt\/sharefs\/wordpress/g" /etc/nginx/sites-available/default

echo "************"
echo "************ add php section"
sed -i -e "s/# pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000/location ~ \\\.php$ {fastcgi_split_path_info ^(.+\\\.php)(\/.+)$;fastcgi_pass unix:\/var\/run\/php5-fpm.sock;fastcgi_index index.php;include fastcgi_params;}/g" /etc/nginx/sites-available/default
