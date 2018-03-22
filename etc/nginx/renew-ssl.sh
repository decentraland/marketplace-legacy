#!/bin/bash

# Create dhparam key
mkdir -p /etc/nginx/keys
SSL_DH=/etc/nginx/keys/dhparam.pem
if [ ! -f ${SSL_DH} ]; then
  openssl dhparam -out ${SSL_DH} 2048
fi

# Renew certs
export LC_ALL="en_US.UTF-8"
export LC_CTYPE="en_US.UTF-8"
wget https://dl.eff.org/certbot-auto -O certbot-auto
chmod a+x ./certbot-auto
./certbot-auto certonly --webroot --webroot-path /var/www -d api.market.decentraland.org
