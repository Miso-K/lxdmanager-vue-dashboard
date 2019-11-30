#!/usr/bin/env bash

setupEnvironment () {
printf '=============Setup the environment=============== \n'.
sudo apt-get update
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install nodejs
sudo apt-get install nginx
}

setupApp () {
printf '===============Setup the Application ================== \n'
cd /home/ubuntu
git clone https://github.com/Miso-K/lxdmanager-vue-dashboard vue-dashboard

echo -e "\nPlease install \"lxd-api-gateway\" with nginx proxy before \"vue-dashboard\""
echo "Now you can set your \"lxd-api-gateway\" URL"
echo -e "\nPlease enter API_BASE_URL eg. https://api.example.com [default: http://127.0.0.1:5000]: "
read API_BASE_URL
echo "Please enter API_BASE_WS_URL eg. https://api.example.com [default: wss://127.0.0.1:8443]: "
read API_BASE_WS_URL

cd vue-dashboard
# Generate the file
sudo bash -c "cat > /home/ubuntu/vue-dashboard/.env <<EOL
API_BASE_URL=${API_BASE_URL}
API_BASE_WS_URL=${API_BASE_WS_URL}
EOL
"

npm install
npm run build

mkdir -p /var/www/vue-dashboard
cp -r /home/ubuntu/vue-dashboard/dist/* /var/www/vue-dashboard
}


configureNginx () {
printf '==================== Configure nginx =================== \n'

#certbot-auto certonly -d ${NAME}.lxdmanager.com --authenticator webroot --webroot-path /var/www/acme

# Create nginx config file
sudo bash -c "cat > /etc/nginx/sites-enabled/${NAME}.conf <<EOF
server {
        listen 80;
        listen [::]:80;

        server_name ${NAME};

	root /var/www/vue-dashboard;

        # Allow access to the ACME Challenge for Let's Encrypt
        location ^~ /.well-known/acme-challenge {
            allow all;
            root /var/www/acme;
        }

#        return 301 https://\$server_name\$request_uri;
}


#server {
#        listen 443 ssl;
#        listen [::]:443;

#        server_name ${NAME};

#        root /var/www/vue-dashboard;
#        index index.html;

#        ssl_certificate /etc/letsencrypt/live/${NAME}/fullchain.pem;
#        ssl_certificate_key /etc/letsencrypt/live/${NAME}/privkey.pem;
#        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
#        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
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

echo "Please enter domain name: [eg. example.com]"
read NAME
run
