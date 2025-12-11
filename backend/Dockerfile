FROM php:8.2-apache

WORKDIR /var/www/html

COPY . /var/www/html

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql


# Update Apache configuration to set DocumentRoot to /var/www/html/public
RUN sed -i 's#/var/www/html#/var/www/html/public#g' /etc/apache2/sites-available/000-default.conf
