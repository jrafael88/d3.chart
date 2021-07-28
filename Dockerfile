FROM node:12.18-alpine
RUN mkdir -p /app
COPY . /app
WORKDIR /app
RUN yarn install
RUN yarn build

FROM nginx:1.19-alpine
COPY --from=0 /app/dist /usr/share/nginx/html
