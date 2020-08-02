FROM php:7.4-fpm-alpine

WORKDIR /var/www/html/app/public
EXPOSE 9000

# lumen packages
RUN apk add --no-cache --update oniguruma-dev 
RUN docker-php-ext-install mbstring tokenizer mysqli pdo_mysql

CMD [ "php-fpm" ]
