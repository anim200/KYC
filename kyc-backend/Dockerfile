# Stage 1: Build the application
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your source code
COPY . .

# Build the TypeScript code (creates the /dist folder)
RUN npm run build

# Stage 2: Run the application
FROM node:18-alpine

WORKDIR /app

# Copy package files again for production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built files from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the .env file (optional, but often easier for simple setups)
COPY .env .env

# Create the pdfs directory if your app expects it
RUN mkdir -p pdfs

EXPOSE 5000

# Start the server
CMD ["node", "dist/index.js"]