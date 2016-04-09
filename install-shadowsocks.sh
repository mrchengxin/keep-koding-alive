#! /bin/sh
sudo apt-get update
wget -N --no-check-certificate https://raw.githubusercontent.com/91yun/serverspeeder/master/serverspeeder-all.sh && bash serverspeeder-all.sh
sudo apt-get install -y python-pip
sudo pip install shadowsocks
sudo mkdir /opt/shadowsocks
sudo cp ./shadowsocks/config.json /opt/shadowsocks/config.json
sudo apt-get install -y supervisor
sudo cp ./supervisor/shadowsocks.conf /etc/supervisor/conf.d/shadowsocks.conf
sudo supervisorctl update
