# frontend/Dockerfile
FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]