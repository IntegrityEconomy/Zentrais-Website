#!/bin/sh
set -e

# Run Prisma migrations if enabled
if [ "$PRISMA_MIGRATE_ON_START" = "true" ] || [ "$PRISMA_MIGRATE_ON_START" = "1" ]; then
  echo "Running Prisma migrations..."
  npx prisma migrate deploy
fi

# Execute the main command
exec "$@"
