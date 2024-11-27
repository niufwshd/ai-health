FROM nginx
EXPOSE 81
COPY ./html /usr/share/nginx/html
ENTRYPOINT nginx -g "daemon off;"