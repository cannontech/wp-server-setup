#!/bin/bash
#GSN WP Client (worker) Setup
#Version 1.0.0

echo "nfs requirements"
apt-get install nfs-common

echo "create a directory for the shared data"
mkdir -p /mnt/nfs/wordpress

echo "mount the shared filesystem"
mount admin.prodwp.gsn2.com:/dev/xvdf/wordpress /mnt/nfs/wordpress

# set automatic mounting in case of reboot
#sed -i -e "s/ admin.prodwp.gsn2.com:/var/nfs /mnt/nfs   nfs auto,noatime,nolock,bg,nfsvers=4,sec=krb5p,intr,tcp,actimeo=1800 0 0/g" /etc/fstab