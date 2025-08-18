FROM node:22

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY src ./src
COPY tsconfig*.json ./

# Build the NestJS app
RUN npm run build

# Expose the port NestJS runs on
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "run", "start:prod"]