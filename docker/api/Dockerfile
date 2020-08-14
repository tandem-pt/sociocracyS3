FROM debian:stretch

RUN apt-get update --fix-missing && apt-get upgrade -y && apt-get install -y \
vim build-essential gcc curl wget make lsb-release apt-transport-https ca-certificates

RUN wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg

RUN echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/php7.3.list

RUN apt-get update --fix-missing

RUN apt-get -y install php7.3 \
php7.3-cli php7.3-fpm php7.3-json php7.3-pdo php7.3-mysql php7.3-zip php7.3-gd php7.3-mbstring \
php7.3-curl php7.3-xml php7.3-bcmath php7.3-json libapache2-mod-php7.3 \
apache2 apache2-utils

RUN curl -sSL https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN curl -sSL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs

RUN useradd --create-home -s /bin/bash default

ENV APACHE_DOCUMENT_ROOT /var/www/html/public/
ENV APACHE_RUN_USER www-data
ENV APACHE_RUN_GROUP www-data
ENV APACHE_LOG_DIR /var/log/apache2
ENV APACHE_RUN_DIR /var/run/apache2
ENV APACHE_LOCK_DIR /var/lock/apache2
ENV APACHE_PID_FILE /var/run/apache2/apache2.pid

RUN sed -i "s/AllowOverride None/AllowOverride All/g" /etc/apache2/apache2.conf
RUN sed -i "s#/var/www/html#/var/www/html/public#g" /etc/apache2/sites-available/000-default.conf

RUN a2enmod rewrite headers
WORKDIR /var/www/html/public
CMD ["/usr/sbin/apache2", "-DFOREGROUND"]
