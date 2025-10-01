FROM node:23-alpine AS final

# Install bash, curl, netcat (for DB wait), and build tools
RUN apk update && apk add --no-cache bash curl netcat-openbsd python3 make g++

# Create a directory for the application
WORKDIR /app

# Create uploads directory and set permissions
RUN mkdir -p /app/uploads && chmod -R 777 /app/uploads

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Install sequelize-cli globally
RUN npm install -g sequelize-cli

# Copy the application code
COPY . .

# Copy scripts and make them executable
COPY scripts /app/scripts/
RUN chmod +x /app/scripts/run-setup-scripts.sh

# Create logs directory and set ownership
RUN mkdir -p /app/logs && chown -R 1000:1000 /app/logs

# Make init.sh executable
RUN chmod +x /app/init.sh

# Expose the application port
EXPOSE 3030

# Use init.sh as entrypoint
ENTRYPOINT ["/app/init.sh"]
