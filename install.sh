#! /bin/sh
sudo apt-get update
sudo apt-get install -y python-pip
pip install shadowsocks
sudo mkdir /opt/shadowsocks
sudo cp ./config.json /opt/shadowsocks/config.json
sudo ssserver -c /opt/shadowsocks/config.json


