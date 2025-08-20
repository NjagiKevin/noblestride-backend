#!/bin/bash

# Wait for the database to be ready
echo "Waiting for database to be ready..."
echo "DB_HOST: $DB_HOST"
echo "DB_PORT: $DB_PORT"
echo "DB_USER: $DB_USERNAME"

until nc -z -v -w30 $DB_HOST $DB_PORT
do
  echo "Waiting for database connection..."
  sleep 2
done

echo "Database is up and running!"

# Run migrations
echo "Running migrations..."
npx sequelize-cli db:migrate

# Run the seeds
echo "Running seeds..."
npx sequelize-cli db:seed:all

echo "Seeds completed successfully!"

# Start the application
echo "Starting the application..."
npm start