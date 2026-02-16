# Use Node.js LTS (Long Term Support)
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
# --omit=dev significantly reduces image size for production
RUN npm ci --omit=dev

# Copy Prisma schema and generate client
# Check if prisma folder exists first to avoid errors if structure varies, 
# but we know it exists.
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["node", "src/app.js"]
# Note: For production, we might want 'node index.js' if that's the entry, 
# or a process manager like PM2, but 'node' is standard for Docker.
