# 设置一台新的 Postgres 服务器

## **主要关注点**
1. postgres 数据存储在哪个目录？
2. 采用 docker 安装 还是二进制安装？
3. 数据还原与备份方式
4. 数据备份策略

## 在 Ubuntu/Debian 上安装

1. **更新系统包列表**

   ```bash
   sudo apt update
   ```

2. **安装 PostgreSQL**

   ```bash
   sudo apt install postgresql postgresql-contrib
   ```

3. **启动 PostgreSQL 服务**

   ```bash
   sudo systemctl start postgresql
   ```

4. **启用自动启动**

   ```bash
   sudo systemctl enable postgresql
   ```

5. **切换到 PostgreSQL 用户**

   ```bash
   sudo -i -u postgres
   ```

6. **创建一个新的数据库用户（可选）**

   ```bash
   createuser --interactive
   ```

7. **创建一个新的数据库（可选）**

   ```bash
   # abc 是刚刚创建的用户
   createdb -O abc new_database
   ```

8. **查看所有数据库用户**

   ```
   psql -d postgres -c "SELECT rolname FROM pg_roles;"
   ```

9. **查看所有数据库**

   ```
   psql -d postgres -c "\l"
   ```


## 常见管理操作

1. **设置用户密码**

   ```shell
   # 连接到 PostgreSQL
   psql -U postgres
   
   # 在 psql 命令行中设置密码
   ALTER USER abc WITH PASSWORD 'new_password';
   ```

2. **查看用户的角色和权限**

   ```shell
   # 连接到 PostgreSQL
   psql -U postgres
   
   # 查看所有用户的权限
   SELECT rolname, rolsuper, rolcreaterole, rolcreatedb, rolcanlogin
   FROM pg_roles;
   
   # 查看用户 abc 可以连接哪些数据库
   SELECT datname,
          (SELECT rolname FROM pg_roles WHERE oid = datdba) AS owner,
          has_database_privilege('admin2', datname, 'connect') AS can_connect
   FROM pg_database;
   ```

3. **在 PostgreSQL 中修改数据存储的位置**

   ```shell
   # 确定当前数据目录
   psql -U postgres -c "SHOW data_directory;"
   
   # 停止 PostgreSQL 服务
   sudo systemctl stop postgresql
   
   # 复制数据目录
   sudo rsync -av /var/lib/postgresql/14/main /data/pg-data
   
   # 确保新的数据目录有正确的权限和所有权
   sudo chown postgres:postgres /data/pg-data
   sudo chmod 755 /data/pg-data
   sudo chmod 755 /data
   
   
   # 配置新的数据目录
   sudo vi /etc/postgresql/14/main/postgresql.conf
   # 找到 data_directory，修改为新的路径：
   data_directory = '/data/pg-data/main'
   
   #重新启动 PostgreSQL 服务
   sudo systemctl start postgresql
   
   #验证新的设置
   psql -U postgres -c "SHOW data_directory;"
   ```

4. **要配置 PostgreSQL 数据库以允许远程连接**

   ```shell
   # 监听所有接口
   sudo vi /etc/postgresql/14/main/postgresql.conf
   # 找到 listen_addresses , 修改为：
   listen_addresses = '*'
   
   # 配置客户端认证
   sudo vi /etc/postgresql/14/main/pg_hba.conf
   在文件末尾添加适当的条目来允许远程连接
   host   all      all      0.0.0.0/0   scram-sha-256
   local   all      root      peer
   
   # 重启 PostgreSQL 服务
   sudo systemctl restart postgresql
   ```

##  Postgres 备份与还原

`pg_dump` 使用一致性快照技术进行备份。即便在数据库运行的状态下，它也能确保备份的数据是一致的。它在开始备份时获取一个全局快照，并在备份期间使用这个快照，因此备份的数据反映的是备份开始时的状态。

1. **使用 `pg_dump` 备份单个数据库**

   ```shell
   # 基本命令格式
   pg_dump -U username -d database_name -f backup_file.sql
   
   # 示例
   pg_dump -U postgres -d ethclientlogs -f backup_file.sql
   ```

2. **使用 `pg_dumpall` 备份所有数据库**

   ```
   pg_dumpall -U postgres > all_databases_backup.sql
   ```

3. **使用 SQL 文件还原单个数据库**

   ```shell
   # 基本命令格式
   psql -U username -d database_name -f backup_file.sql
   
   # 示例
   psql -U postgres -d aaaddd -h localhost -f backup_file.sql
   ```

4. **使用 SQL 文件还原所有数据库**

   ```shell
   # 基本命令格式
   psql -U postgres -h localhost < all_databases_backup.sql
   
   # 示例
   psql -U postgres -h localhost < all_databases_backup.sql
   ```

## Postgres 备份设置

```shell
# 创建备份目录
sudo mkdir /data/backup
chmod 777 /data/backup

# 手动备份
sudo -u root pg_dumpall > /data/backup/all_databases_backup_$(date +%Y%m%d_%H-%M-%S).sql

# 手动同步
sshpass -p 'password123' rsync -avz -e "ssh -p 23" /data/backup root@remotehost:/home/server-1.2.3.4

# 定时备份与同步
crontab -e
# 每天凌晨 1:00 执行备份
0 1 * * * /usr/bin/pg_dumpall > /data/backup/all_databases_backup_$(date +%Y%m%d_%H-%M-%S).sql

# 每小时同步一次
0 * * * * sshpass -p 'password123' rsync -avz -e "ssh -p 23" /data/backup root@remotehost:/home/server-1.2.3.4

# 确保你的任务已正确添加
crontab -l
```



