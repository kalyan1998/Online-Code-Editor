# Dockerfile for Node.js Executor
FROM node:latest
WORKDIR /app
COPY nodejs-executor.js .
RUN npm install express body-parser
CMD ["node", "nodejs-executor.js"]
