# ongdb-graphene

>Graphene图数据建模后端服务，持久化图数据模型

## 说明
- 启动类
```
data.lab.ongdb.RestApiEntrance
```
- 启动脚本
[start.sh](ongdb-graphene/start.sh)

- 前端代理数据接口
```
http://localhost:8081/ongdb-graphene/
https://localhost:8082/ongdb-graphene/
```
- api-docs
```
http://localhost:8081/ongdb-graphene/v2/api-docs
https://localhost:8082/ongdb-graphene/v2/api-docs
http://localhost:8081/ongdb-graphene/swagger-ui.html
https://localhost:8082/ongdb-graphene/swagger-ui.html
```

- Get接口测试
```
http://localhost:8080/ongdb-graphene/main/hello
```

## Docker
- 打包docker镜像
```
sudo docker build -t ongdb-graphene:v-1.0.0 .
```
- 查看镜像
```
sudo docker images
```
- 运行镜像
```
sudo docker run -p 8081:8081 ongdb-graphene:v-1.0.0
```
- 查看docker容器中启动的进程
```
sudo docker ps
```

- 对镜像设置TAG
```
sudo docker tag ongdb-graphene:v-1.0.0 localhost/model/ongdb-graphene:v-1.0.0
```
- 提交到镜像服务器
```
sudo docker push localhost/model/ongdb-graphene:v-1.0.0
```


