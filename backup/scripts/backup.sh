#!/bin/bash

# 备份配置
BACKUP_DIR="/app/backup/data"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILENAME="blog_backup_$DATE.gz"
MONGODB_URI="mongodb://mongo:27017/blog"
RETENTION_DAYS=7

# 创建备份
echo "开始备份MongoDB数据..."
mongodump --uri="$MONGODB_URI" --archive="$BACKUP_DIR/$BACKUP_FILENAME" --gzip

# 检查备份是否成功
if [ $? -eq 0 ]; then
    echo "ok 备份成功: $BACKUP_FILENAME"
else
    echo "no 备份失败"
    exit 1
fi

# 清理旧备份
echo "清理超过 $RETENTION_DAYS 天的旧备份..."
find $BACKUP_DIR -name "blog_backup_*.gz" -type f -mtime +$RETENTION_DAYS -delete

echo "备份完成！"