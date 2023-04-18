FROM node:18-alpine

WORKDIR /app
COPY package.json /app/package.json
RUN npm i

COPY . /app
EXPOSE 5173

ENTRYPOINT ["npm", "run", "startproxy"]