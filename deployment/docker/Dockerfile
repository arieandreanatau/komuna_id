FROM php:8.2-fpm
RUN apt-get update && apt-get install -y git curl zip unzip libpng-dev libonig-dev libxml2-dev && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd && pecl install redis && docker-php-ext-enable redis && apt-get clean && rm -rf /var/lib/apt/lists/*
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html
COPY apps/api .
RUN composer install --no-dev --optimize-autoloader --no-interaction
RUN chown -R www-data:www-data storage bootstrap/cache && chmod -R 775 storage bootstrap/cache
EXPOSE 9000
CMD ["php-fpm"]
