## LXDmanager-vue-dashboard

This application provide frontend for lxdmanager.
You can read more details and try **demo** on https://lxdmanager.com

**1.0.0** — *Possible run it in production*

![dashboard](https://user-images.githubusercontent.com/45683353/61130070-1f70cc80-a4b6-11e9-9bd8-2166abad5988.png)
![dashboard2](https://user-images.githubusercontent.com/45683353/61130071-1f70cc80-a4b6-11e9-928d-696e86bb8469.png)
![servers](https://user-images.githubusercontent.com/45683353/61130072-20096300-a4b6-11e9-81b1-9a8a367dc89d.png)
![users](https://user-images.githubusercontent.com/45683353/61130074-20096300-a4b6-11e9-9f7e-456d6fe33069.png)
![groups](https://user-images.githubusercontent.com/45683353/61130075-20096300-a4b6-11e9-95da-e69deb3ccdc0.png)

## Why ?

The purpose of this application is to provide web gui manager for LXD with additional features and user based management.
It can be used for restrict access to containers for developers or as web management for container hosting clients.

## Credits

This project is based on [vue-cli](https://github.com/lxc-webpanel/dashboard-vue)

## Running requirement

This project require running backend for API from (https://github.com/Miso-K/lxd-api-gateway)

It is recomended to use *Nginx* as webserver and proxy for websocket.

## Install
For installation actual version of *lxdmanager-vue-dashboard* you can use *install_dashboard.sh* script.

``` bash
# Download the script
curl https://raw.githubusercontent.com/Miso-K/lxdmanager-vue-dashboard/master/install_dashboard.sh > install_dashboard.sh
# Set execution permissions
chmod +x install_dashboard.sh
# Run script to install program
./install_dashboard.sh
```

The script download github repository and copy content of directory *dist* into */var/www/lxdmanager-vue-dashboard/* 

You can manualy download repository from github and copy content of directory *dist* where you need.

*Nginx* config templates are stored in *nginx* directory.  

## Configure
Go to */var/www/lxdmanager-vue-dashboard/* and edit *.env* file according to *.env.example*

``` bash
API_BASE_URL - refers to *lxd-api-gateway* host 
API_BASE_WS_URL - refers to lxd host websocket (please set *nginx* proxy)
``` 

You can also change LXDManager logo to yours in *img/logo.png*

## Configure for development and build

Before build set API_BASE_URL and API_BASE_WS_URL in static/.env file

``` bash
API_BASE_URL - refers to *lxd-api-gateway* host
API_BASE_WS_URL - refers to lxd host websocket (please use *nginx* proxy)
``` 

## Development and build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
