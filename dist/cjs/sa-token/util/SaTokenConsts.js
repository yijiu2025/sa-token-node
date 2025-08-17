'use strict';

/*
 * Copyright 2020-2099 sa-token.cc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * Sa-Token 常量类
 *
 * <p>
 *     一般的常量采用就近原则，定义在各自相应的模块中。
 *     但有一些常量没有明确的归属模块，会在很多模块中使用到，比如版本号、开源地址等，属于全局性的础性常量，这些常量统一定义在此类中。
 * </p>
 *
 * @author click33 qirly
 * @since 1.8.0
 */
class SaTokenConsts {

	constructor() {
        // 私有构造函数
    }
	
	// ------------------ Sa-Token 版本信息
	
	/**
	 * Sa-Token 当前版本号 
	 */
	static VERSION_NO = "v1.44.0";

	/**
	 * Sa-Token 开源地址 Gitee 
	 */
	static GITEE_URL = "https://gitee.com/dromara/sa-token";

	/**
	 * Sa-Token 开源地址 GitHub  
	 */
	static GITHUB_URL = "https://github.com/dromara/sa-token";

	/**
	 * Sa-Token-node 开源地址 GitHub  
	 */
	static GITHUB_URL = "https://github.com/yijiu2025/sa-token-node";


	/**
	 * Sa-Token 开发文档地址 
	 */
	static DEV_DOC_URL = "https://sa-token.cc";
	
	
	// ------------------ 常量 key 标记
	
	/**
	 * 常量 key 标记: 如果 token 为本次请求新创建的，则以此字符串为 key 存储在当前请求 str 中
	 */
	static JUST_CREATED = "JUST_CREATED_"; 	

	/**
	 * 常量 key 标记: 如果 token 为本次请求新创建的，则以此字符串为 key 存储在当前 request 中（不拼接前缀，纯Token）
	 */
	static JUST_CREATED_NOT_PREFIX = "JUST_CREATED_NOT_PREFIX_"; 	

	/**
	 * 常量 key 标记: 如果本次请求已经验证过 activeTimeout, 则以此 key 在 storage 中做一个标记
	 */
	static TOKEN_ACTIVE_TIMEOUT_CHECKED_KEY = "TOKEN_ACTIVE_TIMEOUT_CHECKED_KEY_";

	/**
	 * 常量 key 标记: 在登录时，默认使用的设备类型 
	 */
	static DEFAULT_LOGIN_DEVICE_TYPE = "DEF";

	/**
	 * 常量 key 标记: 在封禁账号时，默认封禁的服务类型 
	 */
	static DEFAULT_DISABLE_SERVICE = "login"; 

	/**
	 * 常量 key 标记: 在封禁账号时，默认封禁的等级 
	 */
	static DEFAULT_DISABLE_LEVEL = 1; 

	/**
	 * 常量 key 标记: 在封禁账号时，可使用的最小封禁级别 
	 */
	static MIN_DISABLE_LEVEL = 1; 

	/**
	 * 常量 key 标记: 账号封禁级别，表示未被封禁 
	 */
	static NOT_DISABLE_LEVEL = -2; 
	
	/**
	 * 常量 key 标记: 在进行临时身份切换时使用的 key
	 */
	static SWITCH_TO_SAVE_KEY = "SWITCH_TO_SAVE_KEY_"; 

	/**
	 * 常量 key 标记: 在进行 Token 二级验证时，使用的 key
	 */
	// @Deprecated
	static SAFE_AUTH_SAVE_KEY = "SAFE_AUTH_SAVE_KEY_"; 

	/**
	 * 常量 key 标记: 在进行 Token 二级认证时，写入的 value 值
	 */
	static SAFE_AUTH_SAVE_VALUE = "SAFE_AUTH_SAVE_VALUE"; 

	/**
	 * 常量 key 标记: 在进行 Token 二级验证时，默认的业务类型 
	 */
	static DEFAULT_SAFE_AUTH_SERVICE = "important"; 

	/**
	 * 常量 key 标记: 临时 Token 认证模块，默认的业务类型 
	 */
	// @Deprecated
	static DEFAULT_TEMP_TOKEN_SERVICE = "record"; 


	// ------------------ token-style 相关
	
	/**
	 * Token风格: uuid 
	 */
	static TOKEN_STYLE_UUID = "uuid"; 
	
	/**
	 * Token风格: 简单uuid (不带下划线) 
	 */
	static TOKEN_STYLE_SIMPLE_UUID = "simple-uuid"; 
	
	/**
	 * Token风格: 32位随机字符串 
	 */
	static TOKEN_STYLE_RANDOM_32 = "random-32"; 
	
	/**
	 * Token风格: 64位随机字符串 
	 */
	static TOKEN_STYLE_RANDOM_64 = "random-64"; 
	
	/**
	 * Token风格: 128位随机字符串 
	 */
	static TOKEN_STYLE_RANDOM_128 = "random-128"; 
	
	/**
	 * Token风格: tik风格 (2_14_16) 
	 */
	static TOKEN_STYLE_TIK = "tik";


	// ------------------ SaSession 的类型

	/**
	 * SaSession 的类型: Account-Session
	 */
	static SESSION_TYPE__ACCOUNT = "Account-Session";

	/**
	 * SaSession 的类型: Token-Session
	 */
	static SESSION_TYPE__TOKEN = "Token-Session";

	/**
	 * SaSession 的类型: Anon-Token-Session
	 */
	static SESSION_TYPE__ANON = "Anon-Token-Session";

	/**
	 * SaSession 的类型: Custom-Session
	 */
	static SESSION_TYPE__CUSTOM = "Custom-Session";


	// ------------------ 其它

	/**
	 * 连接 Token 前缀和 Token 值的字符
	 */
	static TOKEN_CONNECTOR_CHAT  = " "; 
	
	/**
	 * 切面、拦截器、过滤器等各种组件的注册优先级顺序
	 */
	static ASSEMBLY_ORDER = -100;

	/**
	 * 防火墙校验过滤器的注册顺序
	 */
	static FIREWALL_CHECK_FILTER_ORDER = -102;

	/**
	 * 跨域处理过滤器的注册顺序
	 */
	static CORS_FILTER_ORDER = -103;

	/**
	 * 上下文过滤器的注册顺序
	 */
	static SA_TOKEN_CONTEXT_FILTER_ORDER = -104;

	/**
	 * RPC 框架权限过滤器的注册顺序
	 */
	static RPC_PERMISSION_FILTER_ORDER = -3e4;

	/**
	 * RPC 框架上下文过滤器的注册顺序
	 */
	static RPC_CONTEXT_FILTER_ORDER = -30005;

	/**
	 * Content-Type  key
	 */
	static CONTENT_TYPE_KEY = "Content-Type";

	/**
	 * Content-Type  text/plain; charset=utf-8
	 */
	static CONTENT_TYPE_TEXT_PLAIN = "text/plain; charset=utf-8";

	/**
	 * Content-Type  application/json;charset=UTF-8
	 */
	static CONTENT_TYPE_APPLICATION_JSON = "application/json;charset=UTF-8";



	
	// =================== 废弃 ===================  

	/**
	 * 请更换为 JUST_CREATED  
	 */
	// @Deprecated
	static JUST_CREATED_SAVE_KEY = this.JUST_CREATED;
    
	/**
	 * 请更换为 TOKEN_ACTIVE_TIMEOUT_CHECKED_KEY
	 */
	// @Deprecated
	static TOKEN_ACTIVITY_TIMEOUT_CHECKED_KEY = this.TOKEN_ACTIVE_TIMEOUT_CHECKED_KEY;


}

module.exports = SaTokenConsts;
