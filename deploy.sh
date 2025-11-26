#!/bin/bash

# 1. Pull latest changes from git
echo "Fetching latest code..."
git pull

# 2. Build and start
# --build forces Docker to run the build steps in the Dockerfile again
# -d runs in detached mode
echo "Rebuilding and deploying..."
docker compose up -d --build --remove-orphans

echo "Done! Frontend is running on port 3031"