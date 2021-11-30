#!/usr/bin/env bash

# 启动脚本
nohup java -Xmx1024m -Dfile.encoding=utf-8 -jar ./ongdb-lab-rest-api-1.0.0.jar >>logs/ongdb-lab-rest-api.log 2>&1 &

# 启动远程调试
#nohup java -Xmx1024m -Dfile.encoding=utf-8 -Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=5005,suspend=n -jar ./ongdb-lab-rest-api-1.0.0.jar >>logs/ongdb-lab-rest-api.log 2>&1 &

# 启动远程调试
#nohup java -Xmx128m -Dfile.encoding=utf-8 -Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=5005,suspend=n -jar ./elasticsearch-monitor-0.1.0.jar >>logs/elasticsearch-monitor.log 2>&1 &

