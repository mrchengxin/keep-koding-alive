**// cannot work anymore**  
**// but you still can run this project on your local to keep the vm always on remotely**  

# keep-koding-alive
keep Koding VM always on by itself, and set up a Shadowsocks server on it  

## What
This project provides solution to keep free-Koding-VM always on as a shadowsocks server.  

> Koding.com is an online IDE for coding. Every free account owns a t2.micro EC2 instance.  
> It also provides a fully accessible Ubuntu terminal. In theory, we can do anything on it.  
> **But instance of free account will be shutdown after 1 hour if online IDE is not active.**

Supports:
* keep instance of free account always on
* set up a shdowsocks server on Koding-instance

## How
##### 1. set password for root first:  
```
sudo passwd root
```
##### 2. clone this project:  
```
git clone https://github.com/mrchengxin/keep-koding-alive.git
```
##### 3. execute install.sh:  
```
cd keep-koding-alive
./install.sh <koding_username> <koding_password> <serverSpeeder_email> <serverSpeeder_password>
```
##### 4. connect shadowsocks:  
default server setting is as below:  
```
{
"server":"0.0.0.0",
"server_port":8123,
"password":"password",
"timeout":500,
"method":"aes-256-cfb",
"fast_open":true,
"workers":10
}
```
you can change it if you like:  
```
sudo vi /etc/shadowsocks/config.json
```
remember to restart ssserver after changing:  
```
sudo supervisorctl restart shadowsocks
```
##### 5. Enjoy

## Remarks
By default, this project uses phantomjs and crontab to keep instance always on from **0:00 to 14:00** (UTC).  
<font size='5'>
**Please make this period as shorter as possible!  
So we can save resources for good!**
</font>  
