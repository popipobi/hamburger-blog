#!/bin/bash

echo "开始部署..."

# 构建和启动Docker容器
docker-compose down
docker-compose build
docker-compose up -d

echo "部署完成！"