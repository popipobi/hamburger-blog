@echo off
echo 正在部署博客应用...

echo 停止并删除旧容器
docker-compose down

echo 构建新镜像...
docker-compose build

echo 启动新容器
docker-compose up -d

echo 部署完成