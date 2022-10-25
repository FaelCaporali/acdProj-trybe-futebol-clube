FROM node:16.14-alpine
WORKDIR /app-frontend

EXPOSE 3000

COPY ["./package.json", "./package-lock.json", "./"]
RUN npm i
COPY ./ .

CMD [ "npm", "start" ]
