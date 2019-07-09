# https://dev.to/peterj/run-a-react-app-in-a-docker-container-kjn
FROM node:10.16-alpine AS builder
WORKDIR /app
COPY ./ ./
RUN yarn run build

FROM node:10.16-alpine
RUN yarn global add serve
WORKDIR /app
COPY --from=builder /app/build .
EXPOSE 80
CMD serve -p 80 -s .