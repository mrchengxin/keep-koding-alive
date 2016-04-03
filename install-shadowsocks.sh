#! /bin/sh
if [ "$#" -ne 4 ]; then
	echo "[INFO] Illegal number of parameters"
	echo "[INFO] Usage: ./install-shadowsocks.sh <koding_username> <koding_password> <serverSpeeder_email> <serverSpeeder_password>"
	exit 1
fi

username=$1
password=$2
serverSpeederEmail=$3
serverSpeederPassword=$4

sudo apt-get update
sudo apt-get install -y python-pip
sudo pip install shadowsocks
sudo mkdir /opt/shadowsocks
sudo cp ./shadowsocks/config.json /opt/shadowsocks/config.json
sudo bash ./serverspeeder/serverSpeederInstaller.sh -e $serverSpeederEmail -p $serverSpeederPassword -in 1000000 -out 1000000 -i eth0 -r -t 0 -gso 1 -rsc 1 -b -f
sudo cp ./serverspeeder/serverSpeeder.conf /serverspeeder/etc/config
sudo service serverSpeeder restart
sudo apt-get install -y supervisor
sudo cp ./supervisor/shadowsocks.conf /etc/supervisor/conf.d/shadowsocks.conf
sudo supervisorctl update
