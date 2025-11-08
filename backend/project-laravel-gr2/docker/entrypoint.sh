#!/bin/bash

if [ ! -f ".env" ]; then
    echo "Creating env file for env $APP_ENV"
    cp .env.example .env
else
    echo "env file exists."
fi

echo "Setting permissions for Laravel storage..."
mkdir -p /var/www/storage/logs
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

composer install --no-progress --no-interaction

php artisan key:generate
php artisan migrate
php artisan queue:work --timeout=60 &
php artisan optimize:clear
php artisan view:clear
php artisan route:clear
php artisan jwt:secret --force

php-fpm -D
nginx -g "daemon off;"
