FROM node:18.9-alpine3.15

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

# npm install runs only if package.json or package-lock.json have changed since last run
RUN npm ci

COPY . .

RUN npm run build

ENTRYPOINT [ "npm", "run", "start" ]
