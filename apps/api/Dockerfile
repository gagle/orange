FROM node:lts-alpine

WORKDIR /app

COPY ./dist/apps/api .

EXPOSE 3000

RUN npm install --production

# Dependencies that Nestjs needs
RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express

CMD node ./main.js
