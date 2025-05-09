#!/bin/bash

echo "开始部署..."

# 添加执行权限到所有脚本
echo "添加执行权限到脚本文件..."
chmod +x *.sh
find . -name "*.sh" -type f -exec chmod +x {} \;

# 构建和启动Docker容器
docker-compose down
docker-compose build
docker-compose up -d

echo "部署完成！"