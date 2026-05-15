# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy the rest of the backend files
COPY . .

# Environment variables
ENV PORT=5000
ENV NODE_ENV=production

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
