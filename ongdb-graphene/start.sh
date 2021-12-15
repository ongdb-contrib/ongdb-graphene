#!/usr/bin/env bash

# 启动脚本
nohup java -Xmx512m -Dfile.encoding=utf-8 -jar ./ongdb-graphene-1.0.0.jar >>logs/ongdb-graphene.log 2>&1 &

# 启动远程调试
#nohup java -Xmx512m -Dfile.encoding=utf-8 -Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=5005,suspend=n -jar ./ongdb-graphene-1.0.0.jar >>logs/ongdb-graphene.log 2>&1 &

