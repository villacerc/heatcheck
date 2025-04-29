# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory for server code
WORKDIR /app

# Copy the server source code from the host to /app/server
COPY ./server ./server

# Copy the client source code from the host to /app/client
COPY ../client ./client

# Install dependencies for both server and client
WORKDIR /app/client
RUN npm install && npm rebuild node-sass && npm run build

WORKDIR /app/server
RUN npm install

EXPOSE 3000

# run server in production mode
CMD ["npm", "run", "start"]

