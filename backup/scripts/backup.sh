#!/bin/bash

# 备份配置
BACKUP_DIR="./backup/data"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILENAME="blog_backup_$DATE.gz"
RETENTION_DAYS=7

mkdir -p $BACKUP_DIR
chmod 777 $BACKUP_DIR

# 创建备份
echo "开始备份MongoDB数据...$(date)"

docker exec blog-mongo mongodump --uri="mongodb://localhost:27017/blog" --archive="/tmp/$BACKUP_FILENAME" --gzip
docker cp blog-mongo:/tmp/$BACKUP_FILENAME $BACKUP_DIR/
docker exec blog-mongo rm /tmp/$BACKUP_FILENAME

chmod 644 $BACKUP_DIR/$BACKUP_FILENAME

# 检查备份是否成功
if [ -f "$BACKUP_DIR/$BACKUP_FILENAME" ]; then
    echo "ok 备份成功: $BACKUP_FILENAME"
    echo "文件大小: $(du -h $BACKUP_DIR/$BACKUP_FILENAME | cut -f1)"
else
    echo "no 备份失败"
    exit 1
fi

# 清理旧备份
echo "清理超过 $RETENTION_DAYS 天的旧备份..."
find $BACKUP_DIR -name "blog_backup_*.gz" -type f -mtime +$RETENTION_DAYS -delete

echo "备份完成！"