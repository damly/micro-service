#!/bin/bash
docker build -t danielfsousa/micro-service-admin .
docker push danielfsousa/micro-service-admin

ssh deploy@$DEPLOY_SERVER << EOF
docker pull danielfsousa/micro-service-admin
docker stop api-boilerplate || true
docker rm api-boilerplate || true
docker rmi danielfsousa/micro-service-admin:current || true
docker tag danielfsousa/micro-service-admin:latest danielfsousa/micro-service-admin:current
docker run -d --restart always --name api-boilerplate -p 3000:3000 danielfsousa/micro-service-admin:current
EOF
