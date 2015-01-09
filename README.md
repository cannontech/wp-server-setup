#AWS GSN WP Setup v1.0.0

##admin instance
run template

ssh into admin box

sudo apt-get update

sudo apt-get install git

sudo git clone https://github.com/cannontech/wp-server-setup.git

cd wp-server-setup

sudo chmod +x *.sh

sudo ./gsn-server-setup.sh

sudo ./admin.sh

logout ssh

*configure wp*
browse to admin IP
fill in form (MyDatabase, wpuser, MyPassword, db string from aws console)

##worker instance
ssh into worker box

sudo apt-get update

sudo apt-get install git

sudo git clone https://github.com/cannontech/wp-server-setup.git

cd wp-server-setup

sudo chmod +x *.sh

sudo ./gsn-server-setup.sh

sudo ./worker.sh

logout ssh
