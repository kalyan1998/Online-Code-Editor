# First stage: build the dependencies
FROM node:latest as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY ruby-executor.js .
RUN npm install express body-parser

# Second stage: build the final image
FROM ruby:latest

WORKDIR /app

COPY --from=build /app /app

COPY ruby-executor.js .

CMD ["node", "ruby-executor.js"]
