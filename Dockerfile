FROM node:16.0.0-alpine as node

ARG workdir=.
LABEL description="deploy react app"
WORKDIR /app
COPY ${workdir}/ /app/
RUN npm install
RUN npm run build

FROM nginx:1.12
COPY --from=node /app/build/ /var/www/dist/
COPY --from=node /app/nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]