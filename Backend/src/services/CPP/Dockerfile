# First stage: build the dependencies
FROM node:latest as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY cpp-executor.js .
RUN npm install express body-parser

# Second stage: build the final image
FROM gcc:latest

WORKDIR /app

COPY --from=build /app /app

COPY cpp-executor.js .

CMD ["node", "cpp-executor.js"]
