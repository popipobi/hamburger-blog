#!/bin/bash

# 设置非交互模式
export DEBIAN_FRONTEND=noninteractive

# 安装cron
apt-get update 
apt-get install -y cron curl gnupg mongodb-database-tools tzdata

# 设置时区
ln -fs /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
dpkg-reconfigure -f noninteractive tzdata

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