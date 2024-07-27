# 设置一台新的 Redis 服务器
## 主要关注点
1. 数据保存在哪？
2. 安装方式 docker 还是 二进制安装？
3. 密码认证
4. 持久化策略

## 在 Ubuntu/Debian 上安装

1. **安装 Redis**

```shell
sudo apt update
sudo apt install redis-server
```

这会从 Ubuntu 的官方仓库安装 Redis 服务器。

2. **配置 Redis（可选）**

Redis 的配置文件位于 `/etc/redis/redis.conf`。你可以编辑这个文件以调整配置，例如持久化选项、密码保护等。

```shell
# 密码保护
requirepass yourstrongpassword

# 持久化
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec

# 修改数据目录
sudo mkdir -p /data/redis-data
sudo chown redis:redis /data/redis-data
sudo chmod 750  /data/redis-data
# 复制数据目录
sudo rsync -av /var/lib/redis /data/redis-data
dir /var/lib/redis 改为
dir /data/redis-data

# 修改 /etc/systemd/system/redis.service  很关键，不然启动不了
 /var/lib/redis 改为 /data/redis-data
```

3. **启动 Redis 服务**

```bash
sudo systemctl start redis.service
sudo systemctl restart redis.service
sudo systemctl stop redis.service
```

  4. **确认 Redis 运行状态**

```bash
sudo systemctl status redis.service
```

5. **开机自启动 Redis**

```bash
sudo systemctl enable redis-server.service
```


## 常见管理操作

```shell
# 连接 redis
redis-cli

# 通过密码认证
auth yourstrongpassword

# 检查持久化状态
info persistence

# 使用配置测试命令
redis-server  /etc/redis/redis.conf  --test-memory

# 查看 redis 日志
sudo cat /var/log/redis/redis-server.log

```




## Redis 备份设置

```shell
# 创建备份目录
sudo mkdir /data/backup
chmod 777 /data/backup

# 手动备份
/data/script/redis-backup.sh

# 手动同步
sshpass -p 'password123' rsync -avz -e "ssh -p 23" /data/backup root@remotehost:/home/server-1.2.3.4

# 定时备份与同步
crontab -e

# 每小时执行备份
0 * * * * /data/script/redis-backup.sh

# 每小时同步一次
0 * * * * sshpass -p 'password123' rsync -avz -e "ssh -p 23" /data/backup root@remotehost:/home/server-1.2.3.4

# 确保你的任务已正确添加
crontab -l
```



## **备份脚本** 

`/data/script/redis-backup.sh`

```sh
#!/bin/bash

# 指定 Redis CLI 路径（根据你的实际环境调整）
REDIS_CLI="/usr/bin/redis-cli"

# 指定备份存放目录
BACKUP_DIR="/data/backup"

# Redis 数据目录
REDIS_DATA_DIR="/data/redis-data"

# 触发 BGSAVE
$REDIS_CLI -a yourstrongpassword  BGSAVE

# 检查 BGSAVE 是否完成
while [ $(redis-cli -a yourstrongpassword info persistence | grep "rdb_bgsave_in_progress:1") ]
do
    echo "Waiting for BGSAVE to complete..."
    sleep 10
done

echo "BGSAVE completed."

# 备份文件名（根据日期生成）
BACKUP_FILE_NAME="redis_backup_$(date +%Y%m%d_%H-%M-%S).rdb"

# 移动备份文件
cp "$REDIS_DATA_DIR/dump.rdb" "$BACKUP_DIR/$BACKUP_FILE_NAME"
```

