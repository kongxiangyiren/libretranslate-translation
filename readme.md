# koishi-plugin-libretranslate-translation

[![npm](https://img.shields.io/npm/v/koishi-plugin-libretranslate-translation?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-libretranslate-translation)

## LibreTranslate 自建翻译

docker-compose

```yaml
version: "3.9"
services:
  libretranslate:
    # 只要中英翻译
    command: "--load-only zh,en"
    image: libretranslate/libretranslate:latest
    restart: unless-stopped
    ports:
      - "5002:5000"
    # environment:
    #   - LT_API_KEYS=true # 使用 api
    #   - LT_REQ_LIMIT=1000 # 设置每个客户端每分钟的最大请求数(超出API密钥设置的限制)
    #   - LT_REQUIRE_API_KEY_SECRET=true # 需要使用API密钥才能以编程方式访问API，除非客户端还发送秘密匹配
    #   - LT_API_KEYS_DB_PATH=/app/db/api_keys.db # Same result as `db/api_keys.db` or `./db/api_keys.db`
    volumes:
      - "./lt-local:/home/libretranslate/.local"
      # - './libretranslate_api_keys:/app/db'
#     networks:
#       - 1panel-network

# networks:
#   1panel-network:
#     external: true
```

<style>
  .language-yaml {
  position: relative;
  display: block !important;
  overflow-x: auto;
  background: #21252b !important;
  color: #c7eae5 !important;
  padding: 10px 5px 10px 15px !important;
  box-shadow: 0 10px 30px 0px rgb(0 0 0 / 40%);
  border-radius: 10px;
}
</style>
