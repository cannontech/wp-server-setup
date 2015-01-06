#!/bin/bash
#GSN WP Host (admin) Setup
#Version 1.0.0

# create a file system and folder on the elastic block store volume (disk)
mkfs -t ext4 /dev/xvdf

# create a mount point
mkdir /usr/share/nginx/wordpress

# mount the attached ebs to /wordpress
mount /dev/xvdf /usr/share/nginx/wordpress

# nfs requirements
apt-get install nfs-kernel-server

# make the directory to share
mkdir /dev/xvdf/wordpress

# change the ownership
chown nobody:nogroup /dev/xvdf/wordpress

# give permission to access the drive to the worker(s)
echo "/dev/xvdf/wordpress 0.0.0.0(rw,sync,no_subtree_check)" &> /etc/exports

service nfs-kernel-server start