FROM node:16.14-alpine
WORKDIR /app-frontend

EXPOSE 3000

COPY ./ .
RUN npm i && npm run build

CMD [ "npm", "start" ]
