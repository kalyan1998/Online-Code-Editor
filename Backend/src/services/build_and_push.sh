#!/bin/bash

# Docker Hub username
DOCKER_HUB_USERNAME="kalyanshiva"

# Arrays of languages and corresponding folders
languages=("cpp" "java" "nodejs" "python" "ruby")
folders=("CPP" "Java" "Node" "Python" "Ruby")

# Function to build and push Docker image
build_and_push() {
  local language=$1
  local folder=$2
  local image_name="${DOCKER_HUB_USERNAME}/${language}-executor"

  echo "Building Docker image for ${language} in folder ${folder}..."
  docker build -t ${image_name}:latest ./${folder}

  if [ $? -eq 0 ]; then
    echo "Successfully built ${image_name}:latest"
  else
    echo "Failed to build ${image_name}:latest"
    exit 1
  fi

  echo "Pushing Docker image for ${language} to Docker Hub..."
  docker push ${image_name}:latest

  if [ $? -eq 0 ]; then
    echo "Successfully pushed ${image_name}:latest to Docker Hub"
  else
    echo "Failed to push ${image_name}:latest to Docker Hub"
    exit 1
  fi
}

# Loop through each language and folder and build/push Docker image
for i in "${!languages[@]}"; do
  build_and_push "${languages[$i]}" "${folders[$i]}"
done
