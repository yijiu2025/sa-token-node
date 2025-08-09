# sa-token-node AI Agent Instructions

这是sa-token的Node.js实现版本的AI代理指导文档。本文档旨在帮助AI代理快速理解和使用这个代码库。

## 项目概述

sa-token-node是一个基于Node.js的权限认证框架,它实现了与Java版本sa-token相同的功能。主要用于:

- 登录认证
- 权限验证 
- 会话管理
- 单点登录
- 令牌管理

## 核心架构

### 关键组件

1. `StpLogic` (sa-token/stp/StpLogic.js)
   - 框架的核心类,实现了主要的认证和权限验证逻辑
   - 负责token的创建、验证、注销等基础功能

2. `SaManager` (sa-token/SaManager.js) 
   - 全局组件管理器
   - 管理配置、存储组件、权限数据源等核心组件

3. `SaHolder` (sa-token/context/SaHolder.js)
   - 上下文持有者
   - 提供对当前环境中Request、Response、Storage等对象的快速访问

### 重要概念

1. Token机制
   - 使用可配置的token风格(默认为uuid)
   - 支持cookie和header两种传输模式
   - Token信息通过`SaTokenDao`进行持久化存储

2. 会话管理
   - 通过`SaSession`实现会话控制
   - 支持账号级别和令牌级别的会话

3. 权限验证
   - 基于RBAC的权限模型
   - 支持多级权限验证
   - 提供注解式验证支持

## 开发模式

### 配置管理

配置通过`SaTokenConfig`类管理,支持以下关键配置:

```javascript
// 示例配置
{
  tokenName: "satoken",        // token名称
  timeout: 2592000,           // token有效期
  activityTimeout: -1,        // token临时有效期
  isConcurrent: true,         // 是否允许并发登录
  isShare: true,              // 在多人登录时是否共享token
  maxLoginCount: 12,          // 最大登录数量
  isLog: true                 // 是否输出操作日志
}
```

### 常用工作流

1. 登录认证
```javascript
// 在StpLogic中实现
StpUtil.login(10001);  // 登录
StpUtil.getLoginId();  // 获取登录ID  
StpUtil.isLogin();     // 判断是否登录
```

2. 权限验证
```javascript
// 判断权限
StpUtil.hasPermission("user:add");
StpUtil.checkPermission("user:add"); 

// 判断角色
StpUtil.hasRole("admin");
StpUtil.checkRole("admin");
```

### 关键文件

- `sa-token/stp/StpLogic.js` - 核心业务逻辑
- `sa-token/SaManager.js` - 全局组件管理
- `sa-token/config/SaTokenConfig.js` - 配置定义
- `sa-token/context/SaHolder.js` - 上下文管理

## 集成点

1. 持久化存储
   - 通过实现`SaTokenDao`接口来自定义存储方式
   - 默认实现为内存存储(`SaTokenDaoDefaultImpl`)

2. 权限数据源  
   - 实现`StpInterface`接口来自定义权限数据获取逻辑
   - 需要实现权限和角色的判断方法

## 调试技巧

1. 开启日志
```javascript
SaManager.setConfig({
  isLog: true,
  isColorLog: true
});
```

2. Token检查
```javascript
// 获取token值
StpUtil.getTokenValue();

// 检查token信息
StpUtil.getTokenInfo();
```

## 最佳实践

1. 使用注解进行权限验证而不是手动调用方法
2. 合理配置token有效期,避免过长或过短
3. 在分布式环境下使用Redis等集中存储方案
4. 使用`try/catch`捕获权限异常进行统一处理

## 常见陷阱

1. 没有正确配置跨域支持导致token传输失败
2. 忘记在响应头中暴露token名称导致前端无法获取token
3. 权限验证逻辑中的死循环或性能问题

需要任何澄清或补充说明吗？我可以针对特定部分提供更多细节。
