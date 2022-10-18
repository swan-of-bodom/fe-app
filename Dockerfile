# Build project
FROM node:16.15 AS build

WORKDIR /app

COPY package*.json .

RUN npm install --force

COPY . .

RUN npm run build

# Setup Nginx
FROM nginx:1.23

COPY --from=build /app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
