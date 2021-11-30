#!/usr/bin/env bash

# 停止脚本
# shellcheck disable=SC2046
kill -9 `ps -ef|grep ongdb-lab-rest-api-1.0.0.jar|grep -v grep|awk '{print $2}'`

