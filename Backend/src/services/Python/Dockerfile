# First stage: build the dependencies
FROM node:latest as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY python-executor.js .
RUN npm install express body-parser

# Second stage: build the final image
FROM python:latest

WORKDIR /app

COPY --from=build /app /app

COPY python-executor.js .

CMD ["node", "python-executor.js"]
