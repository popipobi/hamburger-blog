#!/bin/bash

case "$1" in
  backup)
    echo "执行手动备份..."
    docker exec blog-backup /app/backup/scripts/backup.sh
    ;;
  restore)
    if [ -z "$2" ]; then
      echo "请指定备份文件名，可用备份:"
      docker exec blog-backup ls -la /app/backup/data | grep -v "backup.log"
    else
      docker exec -it blog-backup /app/backup/scripts/restore.sh "$2"
    fi
    ;;
  list)
    echo "可用备份:"
    docker exec blog-backup ls -la /app/backup/data | grep -v "backup.log"
    ;;
  *)
    echo "使用方法: $0 {backup|restore|list}"
    echo "  backup - 创建新的备份"
    echo "  restore <文件名> - 从备份恢复"
    echo "  list - 显示所有可用备份"
    exit 1
esac