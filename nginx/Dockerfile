FROM nginx:1.13.1

COPY cert.key /etc/nginx/cert.key
COPY cert.crt /etc/nginx/cert.crt
COPY configs/* /etc/nginx/conf.d/
COPY mime.types /etc/nginx/mime.types
