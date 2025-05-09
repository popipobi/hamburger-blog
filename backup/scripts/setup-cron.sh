#!/bin/bash

# 安装cron
apt-get update && apt-get -y install cron

# 创建crontab文件
cat > /tmp/crontab << EOF

# 每天大半夜三点钟执行备份
0 3 * * * /app/backup/scripts/backup.sh >> /app/backup/data/backup.log 2>&1
EOF

# 安装crontab
crontab /tmp/crontab

# 启动cron服务
service cron start

# 保持容器运行
tail -f /dev/null