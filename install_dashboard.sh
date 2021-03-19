#!/usr/bin/env bash

setupEnvironment () {
printf '=============Setup the environment=============== \n'.
apt-get update
apt-get install nginx
}

setupApp () {
printf '===============Setup the Application ================== \n'
git clone https://github.com/Miso-K/lxdmanager-vue-dashboard lxdmanager-vue-dashboard

echo -e "\nPlease install \"lxd-api-gateway\" with nginx proxy before \"lxdmanager-vue-dashboard\""

cd lxdmanager-vue-dashboard

mkdir -p /var/www/lxdmanager-vue-dashboard
cp -r lxdmanager-vue-dashboard/dist/* /var/www/lxdmanager-vue-dashboard
}

configureNginx () {
printf '==================== Configure nginx =================== \n'

# certbot-auto certonly -d ${NAME} --authenticator webroot --webroot-path /var/www/acme

# Create nginx config file
bash -c "cat > /etc/nginx/sites-enabled/${NAME}.conf <<EOF
server {
        listen 80;
        listen [::]:80;

        server_name ${NAME};

	      root /var/www/lxdmanager-vue-dashboard;

        # Allow access to the ACME Challenge for Let's Encrypt
        location ^~ /.well-known/acme-challenge {
            allow all;
            root /var/www/acme;
        }

#       Uncomment when using SSL
#        return 301 https://\$server_name\$request_uri;

#       Do not use when using SSL
        location /api/ {
             proxy_pass http://api.${NAME}/api/;
        }
}


#server {
#        listen 443 ssl;
#        listen [::]:443;

#        server_name ${NAME};

#        root /var/www/lxdmanager-vue-dashboard;
#        index index.html;

#        ssl_certificate /etc/letsencrypt/live/${NAME}/fullchain.pem;
#        ssl_certificate_key /etc/letsencrypt/live/${NAME}/privkey.pem;
#        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
#        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

#        location /api/ {
#             proxy_pass https://api.${NAME}/api/;
#        }
#}
EOF
"

nginx -t
service nginx reload
}


run () {
setupEnvironment
setupApp
configureNginx
}

ID=`id -u`
if [ $ID -ne 0 ]; then
   echo "This command must be run as root."
   exit 1
fi

echo "Please enter domain name: [eg. example.com]"
read NAME
run