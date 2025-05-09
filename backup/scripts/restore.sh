#!/bin/bash

# 检查是否提供了备份文件参数
if [ $# -eq 0 ]; then
    echo "使用方法: $0 <备份文件名>"
    echo "可用备份:"
    ls -la /app/backup/data
    exit 1
fi

BACKUP_FILE="./backup/data/$1"

# 检查备份文件是否存在
if [ ! -f "BACKUP_FILE" ]; then
    echo "no 备份文件不存在: $BACKUP_FILE"
    exit 1
fi

# 确认恢复操作
echo "警告！这将覆盖当前数据库内容！"
echo "备份文件: $BACKUP_FILE"
read -p "确认要继续吗？(y/n)" confirm

if [ "$confirm" != "y" ]; then
    echo "操作已取消"
    exit 0
fi

# 执行恢复
echo "开始从 $BACKUP_FILE 恢复数据..."
docker cp "$BACKUP_FILE" blog-mongo:/tmp/restore.gz
docker exec blog-mongo mongorestore --uri="mongodb://localhost:27017/blog" --gzip --archive="/tmp/restore.gz" --drop
docker exec blog-mongo rm /tmp/restore.gz

# 检查恢复是否成功
if [ $? -eq 0 ]; then
    echo "ok 数据恢复成功"
else
    echo "no 数据恢复失败"
    exit 1
fi