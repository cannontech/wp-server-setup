#!/bin/bash
#GSN WP Host (admin) Setup
#Version 1.0.0

echo "************ create a file system and folder on the elastic block store volume (disk)\r"
mkfs -t ext4 /dev/xvdf

echo "************ create a mount point\r"
mkdir /usr/share/nginx/wordpress

echo "************ mount the attached ebs to /wordpress\r"
mount /dev/xvdf /usr/share/nginx/wordpress

echo "************ nfs requirements\r"
apt-get install nfs-kernel-server

echo "************ make the directory to share\r"
mkdir /dev/xvdf/nginx/wordpress

echo "************ change the ownership\r"
chown nobody:nogroup /dev/xvdf/nginx/wordpress

echo "************ give permission to access the drive to the worker(s)\r"
echo "/dev/xvdf/nginx/wordpress 0.0.0.0(rw,sync,no_subtree_check)" &> /etc/exports

service nfs-kernel-server start