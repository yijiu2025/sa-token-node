//############## Sa-Token 配置 (文档: https://sa-token.cc) ##############

export default {
  server: {
    // 端口
    port: 8081
  },
  saToken: {
    // token 名称（同时也是 cookie 名称）
    tokenName: "satoken",
    // token 有效期（单位：秒） 默认30天，-1 代表永久有效
    timeout: 2592000,
    // token 最低活跃频率（单位：秒），如果 token 超过此时间没有访问系统就会被冻结，默认-1 代表不限制，永不冻结
    activeTimeout: -1,
    // 是否允许同一账号多地同时登录 （为 true 时允许一起登录, 为 false 时新登录挤掉旧登录）
    isConcurrent: true,
    // 在多人登录同一账号时，是否共用一个 token （为 true 时所有登录共用一个 token, 为 false 时每次登录新建一个 token）
    isShare: false,
    // token 风格（默认可取值：uuid、simple-uuid、random-32、random-64、random-128、tik）
    tokenStyle: "uuid",
    // 是否输出操作日志
    isLog: true,
  },
  spring: {
    redis: {
      // Redis数据库索引（默认为0）
      database: 0,
      // Redis服务器地址
      host: "127.0.0.1",
      // Redis服务器连接端口
      port: 6379,
      // Redis服务器连接密码（默认为空）
      password: "",
      // 连接超时时间
      timeout: 10,
      lettuce: {
        pool: {
          // 连接池最大连接数
          maxActive: 200,
          // 连接池最大阻塞等待时间（使用负值表示没有限制）
          maxWait: -1,
          // 连接池中的最大空闲连接
          maxIdle: 10,
          // 连接池中的最小空闲连接
          minIdle: 0,
        }
      }
    }
  }
};