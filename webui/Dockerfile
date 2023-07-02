FROM node:18-alpine as build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY . ./

ARG API_BASE_URL
ENV VITE_API_URL=${API_BASE_URL}

RUN npm run build

FROM nginx:1.17.0-alpine
COPY --from=build /app/build /var/www
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

ENTRYPOINT ["nginx","-g","daemon off;"]