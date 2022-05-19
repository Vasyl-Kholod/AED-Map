# Name the node stage "builder"
FROM node:14.17.4-alpine AS builder
# Set working directory
WORKDIR /app
# Copy all files from current directory to working dir in image
COPY . .
# Remove UI part
RUN rm -rf ./client
# Install dependencies
RUN yarn install
# Expose port 3012
EXPOSE 3012
# Run server
CMD [ "yarn", "start:server:prod" ]
