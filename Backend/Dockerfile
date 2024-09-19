# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:22

# Create and change to the app directory.
WORKDIR /app

# Copy local code to the container image.
COPY . .

RUN npm install 

# Run the web service on container startup.
CMD [ "npm", "start" ]
