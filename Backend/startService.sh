kubectl apply -f ./src/templates/mongodb-deployment.yaml
kubectl apply -f ./src/templates/kafka-deployment.yaml
kubectl apply -f ./src/templates/language-executors-deployment.yaml
kubectl apply -f ./src/templates/consumer-deployment.yaml
kubectl apply -f ./src/templates/producer-deployment.yaml