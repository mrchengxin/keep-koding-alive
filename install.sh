#! /bin/sh
username=$1
password=$2

sudo apt-get update
sudo apt-get install -y python-pip
sudo pip install shadowsocks
sudo mkdir /opt/shadowsocks
sudo cp ./config.json /opt/shadowsocks/config.json
#sudo ssserver -c /opt/shadowsocks/config.json
#wget http://my.serverspeeder.com/d/ls/serverSpeederInstaller.tar.gz
#tar xzvf serverSpeederInstaller.tar.gz
#sudo bash serverSpeederInstaller.sh
#sudo vi /serverspeeder/etc/config
sudo pip install supervisor
sudo cp ./shadowsocks.conf /etc/supervisor/conf.d/shadowsocks.conf
sudo supervisorctl update
sudo mkdir /home/keepOn
sudo git clone https://github.com/Pyppe/phantomjs2.0-ubuntu14.04x64.git
sudo cp phantomjs2.0-ubuntu14.04x64/bin/phantomjs /home/keepOn/phantomjs
sudo cp ./koding.js /home/keepOn/koding.js
crontab -l | { cat; echo "*/10 0-14 * * * /home/keepOn/phantomjs /home/keepOn/koding.js $username $password > /home/keepOn/log"; } | crontab -
