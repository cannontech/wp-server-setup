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
mkdir /usr/share/nginx/wordpress

#echo "************"
#echo "************ make the directory to share"
#mkdir /dev/xvdf/wordpress

echo "************"
echo "************ mount the attached ebs to /wordpress"
mount /dev/xvdf /usr/share/nginx/wordpress

echo "************"
echo "************ change the ownership"
chown nobody:nogroup /dev/xvdf

echo "************"
echo "************ give permission to access the drive to the worker(s)"
echo "/dev/xvdf 0.0.0.0(rw,sync,no_subtree_check)" &> /etc/exports

service nfs-kernel-server start