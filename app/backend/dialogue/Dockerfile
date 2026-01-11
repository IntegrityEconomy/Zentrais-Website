# Use Debian-based Node.js image
FROM node:18-bullseye

# Set working directory inside container
WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project (includes src/, tsconfig.json, prisma/, etc.)
COPY . .

# Generate Prisma client
RUN npx prisma generate
#RUN npx prisma migrate deploy

# Build TypeScript project
RUN npm run build

# Expose API port
EXPOSE 3000

# Optional: run prisma migrations on startup when PRISMA_MIGRATE_ON_START=true|1
RUN chmod +x ./docker-entrypoint.sh
ENTRYPOINT ["./docker-entrypoint.sh"]

# Start the compiled app
CMD ["node", "dist/main.js"]

