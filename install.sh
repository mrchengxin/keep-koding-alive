#! /bin/sh
username=$1
password=$2
serverSpeederEmail=$3
serverSpeederPassword=$4

sudo apt-get update
sudo apt-get install -y python-pip
sudo pip install shadowsocks
sudo mkdir /opt/shadowsocks
sudo cp ./config.json /opt/shadowsocks/config.json
sudo bash ./serverSpeederInstaller.sh -e $serverSpeederEmail -p $serverSpeederPassword -in 1000000 -out 1000000 -i eth0 -r -t 0 -gso 1 -rsc 1 -b -f
sudo service serverSpeeder restart
sudo apt-get install supervisor
sudo cp ./shadowsocks.conf /etc/supervisor/conf.d/shadowsocks.conf
sudo supervisorctl update
sudo mkdir /home/keepOn
sudo cp ./phantomjs /home/keepOn/phantomjs
sudo cp ./koding.js /home/keepOn/koding.js
crontab -l | { cat; echo "*/10 0-14 * * * /home/keepOn/phantomjs /home/keepOn/koding.js $username $password > /home/keepOn/log"; } | crontab -
