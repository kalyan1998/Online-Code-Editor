# First stage: build the dependencies
FROM node:latest as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY java-executor.js .
RUN npm install express body-parser

# Second stage: build the final image
FROM openjdk:latest

WORKDIR /app

COPY --from=build /app /app

COPY java-executor.js .

CMD ["node", "java-executor.js"]