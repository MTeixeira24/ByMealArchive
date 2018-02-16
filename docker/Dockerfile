FROM smebberson/alpine-nginx-nodejs

ARG BUILD_ENV

COPY www /usr/html/

COPY SSL /etc/ssl/ 

COPY docker/conf/${BUILD_ENV} /etc/nginx

RUN cd /usr/html/ && npm install && NODE_ENV="production" ./node_modules/.bin/webpack && chown -R nginx:nginx /usr/html/ && chmod -R 770 /usr/html/ && rm -rf node_modules

