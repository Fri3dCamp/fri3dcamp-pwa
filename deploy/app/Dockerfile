FROM wordpress:php7.4

# Install stuff
RUN apt-get update -y \
	&& apt-get -y install libgmp-dev \
	&& docker-php-ext-install gmp

ADD php/ /usr/local/etc/php/conf.d/

# Enable headers module.
RUN a2enmod headers
