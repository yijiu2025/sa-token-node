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
 * SaTokenConfig 类，用于配置 Sa-Token 的核心参数。
 * 对应 Java 中的 `cn.dev33.satoken.config.SaTokenConfig` 类。
 */

import SaFoxUtil from "./utils/SaFoxUtil";
import SaReplacedRange from "../stp/parameter/enums/SaReplacedRange.js";
import SaLogoutMode from "../stp/parameter/enums/SaLogoutMode";
import SaLogoutRange from "../stp/parameter/enums/SaLogoutRange";
import SaCookieConfig from "./SaCookieConfig.js";

/**
 * Sa-Token 配置类 Model
 *
 * <p>
 *     你可以通过yml、properties、java代码等形式配置本类参数，具体请查阅官方文档:
 *     <a href="https://sa-token.cc">https://sa-token.cc</a>
 * </p>
 *
 * @author click33
 * @since 1.10.0
 */

class SaTokenConfig {
    /**
     * 构造函数，初始化默认值。
     */
    constructor() {
        // Token 相关配置

        /** token 名称 （同时也是： cookie 名称、提交 token 时参数的名称、存储 token 时的 key 前缀） */
        this.tokenName = "satoken"; // Token 名称
        
        /** token 有效期（单位：秒） 默认30天，-1 代表永久有效 */
        this.timeout = 60 * 60 * 24 * 30; // Token 有效期（单位：秒），默认 30 天
        
        /**
         * token 最低活跃频率（单位：秒），如果 token 超过此时间没有访问系统就会被冻结，默认-1 代表不限制，永不冻结
         * （例如可以设置为 1800 代表 30 分钟内无操作就冻结）
         */
        this.activeTimeout = -1; // Token 活跃有效期（单位：秒），-1 表示不限制
        
        /**
         * 是否启用动态 activeTimeout 功能，如不需要请设置为 false，节省缓存请求次数
         */
        this.dynamicActiveTimeout = false; // 是否动态续签 activeTimeout
        
        /**
         * 是否允许同一账号多地同时登录 （为 true 时允许一起登录, 为 false 时新登录挤掉旧登录）
         */
        this.isConcurrent = true; // 是否允许并发登录
        
        /**
         * 在多人登录同一账号时，是否共用一个 token （为 true 时所有登录共用一个 token, 为 false 时每次登录新建一个 token）
         */
        this.isShare = false; // 是否共享 Token
        
        /**
         * 当 isConcurrent=false 时，顶人下线的范围 (CURR_DEVICE_TYPE=当前指定的设备类型端, ALL_DEVICE_TYPE=所有设备类型端)
         */
        this.replacedRange = SaReplacedRange.CURR_DEVICE_TYPE; // Token 替换范围
        
        /**
         * 同一账号最大登录数量，-1代表不限 （只有在 isConcurrent=true, isShare=false 时此配置项才有意义）
         */
        this.maxLoginCount = 12; // 同一账号最大登录数量
        
        /**
         * 溢出 maxLoginCount 的客户端，将以何种方式注销下线 (LOGOUT=注销下线, KICKOUT=踢人下线, REPLACED=顶人下线)
         */
        this.overflowLogoutMode = SaLogoutMode.LOGOUT; // 超出最大登录数量时的处理模式
        
        /**
         * 在每次创建 token 时的最高循环次数，用于保证 token 唯一性（-1=不循环尝试，直接使用）
         */
        this.maxTryTimes = 12; // 最大尝试次数（如登录失败重试）
        
        /**
         * token 风格（默认可取值：uuid、simple-uuid、random-32、random-64、random-128、tik）
         */
        this.tokenStyle = "uuid"; // Token 生成风格（如 "uuid"、"random" 等）
        
        /**
         * token 前缀, 前端提交 token 时应该填写的固定前缀，格式样例(satoken: Bearer xxxx-xxxx-xxxx-xxxx)
         */
        this.tokenPrefix = ""; // Token 前缀
        
        /**
         * cookie 模式是否自动填充 token 前缀
         */
        this.cookieAutoFillPrefix = false; 

        // 请求相关配置

        /**
         * 是否尝试从请求体里读取 token
         */
        this.isReadBody = true; // 是否从请求体中读取 Token
        
        /**
         * 是否尝试从 header 里读取 token
         */
        this.isReadHeader = true; // 是否从请求头中读取 Token
        
        /**
         * 是否尝试从 cookie 里读取 token
         */
        this.isReadCookie = true; // 是否从 Cookie 中读取 Token
        
        /**
         * 是否在登录后将 token 写入到响应头
         */
        this.isWriteHeader = false; // 是否将 Token 写入响应头
        
        /**
         * 是否为持久Cookie（临时Cookie在浏览器关闭时会自动删除，持久Cookie在重新打开后依然存在）
         */
        this.isLastingCookie = true; // 是否持久化 Cookie

        // 会话相关配置
        /**
         * 注销范围 (TOKEN=只注销当前 token 的会话，ACCOUNT=注销当前 token 指向的 loginId 其所有客户端会话)
         * <br/> (此参数只在调用 StpUtil.logout() 时有效)
         */
        this.logoutRange = SaLogoutRange.TOKEN; // 注销范围

        /**
         * 如果 token 已被冻结，是否保留其操作权 (是否允许此 token 调用注销API)
         * <br/> (此参数只在调用 StpUtil.[logout/kickout/replaced]ByTokenValue("token") 时有效)
         */
        this.isLogoutKeepFreezeOps = false; // 注销时是否保留冻结操作
        
        /**
         * 在注销 token 后，是否保留其对应的 Token-Session
         */
        this.isLogoutKeepTokenSession = false; // 注销时是否保留 Token 会话
        
        /**
         * 在登录时，是否立即创建对应的 Token-Session （true=在登录时立即创建，false=在第一次调用 getTokenSession() 时创建）
         */
        this.rightNowCreateTokenSession = false; // 是否立即创建 Token 会话
        
        /**
         * 获取 Token-Session 时是否必须登录（如果配置为true，会在每次获取 getTokenSession() 时校验当前是否登录）
         */
        this.tokenSessionCheckLogin = true; // 是否检查 Token 会话的登录状态
        
        /**
         * 是否打开自动续签 activeTimeout （如果此值为 true, 框架会在每次直接或间接调用 getLoginId() 时进行一次过期检查与续签操作）
         */
        this.autoRenew = true; // 是否自动续签 Token

        // 日志相关配置
        /**
         * 是否在初始化配置时在控制台打印版本字符画
         */
        this.isPrint = true; // 是否打印日志
        
        /**
         * 是否打印操作日志
         */
        this.isLog = false; // 是否启用日志
        
        /**
         * 日志等级（trace、debug、info、warn、error、fatal），此值与 logLevelInt 联动
         */
        this.logLevel = "trace"; // 日志级别
        
        /**
         * 日志等级 int 值（1=trace、2=debug、3=info、4=warn、5=error、6=fatal），此值与 logLevel 联动
         */
        this.logLevelInt = 1; // 日志级别（数字）
        
        /**
         * 是否打印彩色日志
         */
        this.isColorLog = null; // 是否启用彩色日志

        // 其他配置
        /**
         * 默认 SaTokenDao 实现类中，每次清理过期数据间隔的时间（单位: 秒），默认值30秒，设置为 -1 代表不启动定时清理
         */
        this.dataRefreshPeriod = 30; // 数据刷新周期（单位：秒）
        
        /**
         * jwt秘钥（只有集成 jwt 相关模块时此参数才会生效）
         */
        this.jwtSecretKey = ""; // JWT 密钥
        
        /**
         * Http Basic 认证的默认账号和密码，冒号隔开，例如：sa:123456
         */
        this.httpBasic = ""; // HTTP Basic 认证
        
        /**
         * Http Digest 认证的默认账号和密码，冒号隔开，例如：sa:123456
         */
        this.httpDigest = ""; // HTTP Digest 认证
        
        /**
         * 配置当前项目的网络访问地址
         */
        this.currDomain = ""; // 当前域名
        
        /**
         * Same-Token 的有效期 (单位: 秒)
         */
        this.sameTokenTimeout = 60 * 60 * 24; // 相同 Token 有效期（单位：秒）
        
        /**
         * 是否校验 Same-Token（部分rpc插件有效）
         */
        this.checkSameToken = false; // 是否检查相同 Token

        /**
         * Cookie配置对象 
         */
        this.cookie = new SaCookieConfig(); 
    }

    /**
     * @return token 名称 （同时也是： cookie 名称、提交 token 时参数的名称、存储 token 时的 key 前缀）
     */
    getTokenName() {
        return this.tokenName;
    }

    /**
     * @param tokenName token 名称 （同时也是： cookie 名称、提交 token 时参数的名称、存储 token 时的 key 前缀）
     * @return 对象自身
     */
    setTokenName(tokenName) {
        this.tokenName = tokenName;
        return this;
    }

    /**
     * @return token 有效期（单位：秒） 默认30天，-1 代表永久有效
     */
    getTimeout() {
        return this.timeout;
    }

    /**
	 * @param timeout token 有效期（单位：秒） 默认30天，-1 代表永久有效
	 * @return 对象自身
	 */
    setTimeout(timeout) {
        this.timeout = timeout;
        return this;
    }

    /**
     * @return token 最低活跃频率（单位：秒），如果 token 超过此时间没有访问系统就会被冻结，默认-1 代表不限制，永不冻结
     * 							（例如可以设置为 1800 代表 30 分钟内无操作就冻结）
     */
    getActiveTimeout() {
        return this.activeTimeout;
    }

    /**
     * @param activeTimeout token 最低活跃频率（单位：秒），如果 token 超过此时间没有访问系统就会被冻结，默认-1 代表不限制，永不冻结
     * 								（例如可以设置为 1800 代表 30 分钟内无操作就冻结）
     * @return 对象自身
     */
    setActiveTimeout(activeTimeout) {
        this.activeTimeout = activeTimeout;
        return this;
    }

    /**
     * @return 是否启用动态 activeTimeout 功能，如不需要请设置为 false，节省缓存请求次数
     */
    getDynamicActiveTimeout() {
        return this.dynamicActiveTimeout;
    }

    /**
     * @param dynamicActiveTimeout 是否启用动态 activeTimeout 功能，如不需要请设置为 false，节省缓存请求次数
     * @return 对象自身
     */
    setDynamicActiveTimeout(dynamicActiveTimeout) {
        this.dynamicActiveTimeout = dynamicActiveTimeout;
        return this;
    }

    /**
     * @return 是否允许同一账号多地同时登录 （为 true 时允许一起登录, 为 false 时新登录挤掉旧登录）
     */
    getIsConcurrent() {
        return this.isConcurrent;
    }

    /**
     * @param isConcurrent 是否允许同一账号多地同时登录 （为 true 时允许一起登录, 为 false 时新登录挤掉旧登录）
     * @return 对象自身
     */
    setIsConcurrent(isConcurrent) {
        this.isConcurrent = isConcurrent;
        return this;
    }

    /**
     * @return 在多人登录同一账号时，是否共用一个 token （为 true 时所有登录共用一个token, 为 false 时每次登录新建一个 token）
     */
    getIsShare() {
        return this.isShare;
    }

    /**
     * @param isShare 在多人登录同一账号时，是否共用一个 token （为 true 时所有登录共用一个token, 为 false 时每次登录新建一个 token）
     * @return 对象自身
     */
    setIsShare(isShare) {
        this.isShare = isShare;
        return this;
    }

    /**
     * @return 同一账号最大登录数量，-1代表不限 （只有在 isConcurrent=true, isShare=false 时此配置项才有意义）
     */
    getMaxLoginCount() {
        return this.maxLoginCount;
    }

    /**
     * @param maxLoginCount 同一账号最大登录数量，-1代表不限 （只有在 isConcurrent=true, isShare=false 时此配置项才有意义）
     * @return 对象自身 
     */
    setMaxLoginCount(maxLoginCount) {
        this.maxLoginCount = maxLoginCount;
        return this;
    }

    /**
     * @return {int} 在每次创建 token 时的最高循环次数，用于保证 token 唯一性（-1=不循环尝试，直接使用）
     */
    getMaxTryTimes() {
        return this.maxTryTimes;
    }

    /**
     * @param maxTryTimes 在每次创建 token 时的最高循环次数，用于保证 token 唯一性（-1=不循环尝试，直接使用）
     * @return 对象自身
     */
    setMaxTryTimes(maxTryTimes) {
        this.maxTryTimes = maxTryTimes;
        return this;
    }

    /**
     * @return {boolean} 是否尝试从请求体里读取 token
     */
    getIsReadBody() {
        return this.isReadBody;
    }

    /**
     * @param isReadBody 是否尝试从请求体里读取 token
     * @return 对象自身
     */
    setIsReadBody(isReadBody) {
        this.isReadBody = isReadBody;
        return this;
    }
    
    /**
     * @return 是否尝试从 header 里读取 token
     */
    getIsReadHeader() {
        return this.isReadHeader;
    }

    /**
     * @param isReadHeader 是否尝试从 header 里读取 token
     * @return 对象自身
     */
    setIsReadHeader(isReadHeader) {
        this.isReadHeader = isReadHeader;
        return this;
    }

    /**
     * @return 是否尝试从 cookie 里读取 token
     */
    getIsReadCookie() {
        return this.isReadCookie;
    }

    /**
     * @param isReadCookie 是否尝试从 cookie 里读取 token
     * @return 对象自身
     */
    setIsReadCookie(isReadCookie) {
        this.isReadCookie = isReadCookie;
        return this;
    }

    /**
     * 获取 是否为持久Cookie（临时Cookie在浏览器关闭时会自动删除，持久Cookie在重新打开后依然存在）
     *
     * @return isLastingCookie /
     */
    getIsLastingCookie() {
        return this.isLastingCookie;
    }

    /**
     * 设置 是否为持久Cookie（临时Cookie在浏览器关闭时会自动删除，持久Cookie在重新打开后依然存在）
     *
     * @param isLastingCookie /
     * @return 对象自身
     */
    setIsLastingCookie(isLastingCookie) {
        this.isLastingCookie = isLastingCookie;
        return this;
    }

    /**
     * @return 是否在登录后将 token 写入到响应头
     */
    getIsWriteHeader() {
        return this.isWriteHeader;
    }

    /**
     * @param isWriteHeader 是否在登录后将 token 写入到响应头
     * @return 对象自身
     */
    setIsWriteHeader(isWriteHeader) {
        this.isWriteHeader = isWriteHeader;
        return this;
    }

    /**
     * @return token 风格（默认可取值：uuid、simple-uuid、random-32、random-64、random-128、tik）
     */
    getTokenStyle() {
        return this.tokenStyle;
    }

    /**
     * @param tokenStyle token 风格（默认可取值：uuid、simple-uuid、random-32、random-64、random-128、tik）
     * @return 对象自身
     */
    setTokenStyle(tokenStyle) {
        this.tokenStyle = tokenStyle;
        return this;
    }

    /**
     * @return 默认 SaTokenDao 实现类中，每次清理过期数据间隔的时间（单位: 秒），默认值30秒，设置为 -1 代表不启动定时清理
     */
    getDataRefreshPeriod() {
        return this.dataRefreshPeriod;
    }

    /**
     * @param dataRefreshPeriod 默认 SaTokenDao 实现类中，每次清理过期数据间隔的时间（单位: 秒），默认值30秒，设置为 -1 代表不启动定时清理
     * @return 对象自身
     */
    setDataRefreshPeriod(dataRefreshPeriod) {
        this.dataRefreshPeriod = dataRefreshPeriod;
        return this;
    }

    /**
     * @return 获取 Token-Session 时是否必须登录（如果配置为true，会在每次获取 getTokenSession() 时校验当前是否登录）
     */
    getTokenSessionCheckLogin() {
        return this.tokenSessionCheckLogin;
    }

    /**
     * @param tokenSessionCheckLogin 获取 Token-Session 时是否必须登录（如果配置为true，会在每次获取 getTokenSession() 时校验当前是否登录）
     * @return 对象自身
     */
    setTokenSessionCheckLogin(tokenSessionCheckLogin) {
        this.tokenSessionCheckLogin = tokenSessionCheckLogin;
        return this;
    }

    /**
     * @return 是否打开自动续签 activeTimeout （如果此值为 true, 框架会在每次直接或间接调用 getLoginId() 时进行一次过期检查与续签操作）
     */
    getAutoRenew() {
        return this.autoRenew;
    }

    /**
     * @param autoRenew 是否打开自动续签 activeTimeout （如果此值为 true, 框架会在每次直接或间接调用 getLoginId() 时进行一次过期检查与续签操作）
     * @return 对象自身
     */
    setAutoRenew(autoRenew) {
        this.autoRenew = autoRenew;
        return this;
    }

    /**
     * @return token 前缀, 前端提交 token 时应该填写的固定前缀，格式样例(satoken: Bearer xxxx-xxxx-xxxx-xxxx)
     */
    getTokenPrefix() {
        return this.tokenPrefix;
    }

    /**
     * @param tokenPrefix token 前缀, 前端提交 token 时应该填写的固定前缀，格式样例(satoken: Bearer xxxx-xxxx-xxxx-xxxx)
     * @return 对象自身
     */
    setTokenPrefix(tokenPrefix) {
        this.tokenPrefix = tokenPrefix;
        return this;
    }

    /**
     * @return cookie 模式是否自动填充 token 前缀
     */
    getCookieAutoFillPrefix() {
        return this.cookieAutoFillPrefix;
    }

    /**
     * @param cookieAutoFillPrefix cookie 模式是否自动填充 token 前缀
     * @return 对象自身
     */
    setCookieAutoFillPrefix(cookieAutoFillPrefix) {
        this.cookieAutoFillPrefix = cookieAutoFillPrefix;
        return this;
    }

    /**
     * @return 是否在初始化配置时在控制台打印版本字符画
     */
    getIsPrint() {
        return this.isPrint;
    }

    /**
     * @param isPrint 是否在初始化配置时在控制台打印版本字符画
     * @return 对象自身
     */
    setIsPrint(isPrint) {
        this.isPrint = isPrint;
        return this;
    }

    /**
     * @return 是否打印操作日志
     */
    getIsLog() {
        return this.isLog;
    }

    /**
     * @param isLog 是否打印操作日志
     * @return 对象自身
     */
    setIsLog(isLog) {
        this.isLog = isLog;
        return this;
    }

    /**
     * @return 日志等级（trace、debug、info、warn、error、fatal），此值与 logLevelInt 联动
     */
    getLogLevel() {
        return this.logLevel;
    }

    /**
     * @param logLevel 日志等级（trace、debug、info、warn、error、fatal），此值与 logLevelInt 联动
     * @return 对象自身
     */
    setLogLevel(logLevel) {
        this.logLevel = logLevel;
        this.logLevelInt = SaFoxUtil.translateLogLevelToInt(logLevel); // 假设 SaFoxUtil 已定义
        return this;
    }

    /**
     * @return 日志等级 int 值（1=trace、2=debug、3=info、4=warn、5=error、6=fatal），此值与 logLevel 联动
     */
    getLogLevelInt() {
        return this.logLevelInt;
    }

    /**
     * @param logLevelInt 日志等级 int 值（1=trace、2=debug、3=info、4=warn、5=error、6=fatal），此值与 logLevel 联动
     * @return 对象自身
     */
    setLogLevelInt(logLevelInt) {
        this.logLevelInt = logLevelInt;
        this.logLevel = SaFoxUtil.translateLogLevelToString(logLevelInt); // 假设 SaFoxUtil 已定义
        return this;
    }

    /**
     * 获取：是否打印彩色日志
     *
     * @return isColorLog 是否打印彩色日志
     */
    getIsColorLog() {
        return this.isColorLog;
    }

    /**
     * 设置：是否打印彩色日志
     *
     * @param isColorLog 是否打印彩色日志
     * @return 对象自身
     */
    setIsColorLog(isColorLog) {
        this.isColorLog = isColorLog;
        return this;
    }

    /**
     * @return jwt秘钥（只有集成 jwt 相关模块时此参数才会生效）
     */
    getJwtSecretKey() {
        return this.jwtSecretKey;
    }

    /**
     * @param jwtSecretKey jwt秘钥（只有集成 jwt 相关模块时此参数才会生效）
     * @return 对象自身
     */
    setJwtSecretKey(jwtSecretKey) {
        this.jwtSecretKey = jwtSecretKey;
        return this;
    }

    /**
     * @return Http Basic 认证的默认账号和密码，冒号隔开，例如：sa:123456
     */
    getHttpBasic() {
        return this.httpBasic;
    }

    /**
     * @param httpBasic Http Basic 认证的默认账号和密码，冒号隔开，例如：sa:123456
     * @return 对象自身
     */
    setHttpBasic(httpBasic) {
        this.httpBasic = httpBasic;
        return this;
    }

    /**
     * @return Http Digest 认证的默认账号和密码，冒号隔开，例如：sa:123456
     */
    getHttpDigest() {
        return this.httpDigest;
    }

    /**
     * @param httpDigest Http Digest 认证的默认账号和密码，冒号隔开，例如：sa:123456
     * @return 对象自身
     */
    setHttpDigest(httpDigest) {
        this.httpDigest = httpDigest;
        return this;
    }

    /**
     * @return 配置当前项目的网络访问地址
     */
    getCurrDomain() {
        return this.currDomain;
    }

    /**
     * @param currDomain 配置当前项目的网络访问地址
     * @return 对象自身
     */
    setCurrDomain(currDomain) {
        this.currDomain = currDomain;
        return this;
    }

    /**
     * @return Same-Token 的有效期 (单位: 秒)
     */
    getSameTokenTimeout() {
        return this.sameTokenTimeout;
    }

    /**
     * @param sameTokenTimeout Same-Token 的有效期 (单位: 秒)
     * @return 对象自身
     */
    setSameTokenTimeout(sameTokenTimeout) {
        this.sameTokenTimeout = sameTokenTimeout;
        return this;
    }

    /**
     * @return 是否校验Same-Token（部分rpc插件有效）
     */
    getCheckSameToken() {
        return this.checkSameToken;
    }

    /**
     * @param checkSameToken 是否校验Same-Token（部分rpc插件有效）
     * @return 对象自身
     */
    setCheckSameToken(checkSameToken) {
        this.checkSameToken = checkSameToken;
        return this;
    }

    /**
     * 获取 当 isConcurrent=false 时，顶人下线的范围 (CURR_DEVICE_TYPE=当前指定的设备类型端 ALL_DEVICE_TYPE=所有设备类型端)
     *
     * @return /
     */
    getReplacedRange() {
        return this.replacedRange;
    }

    /**
     * 设置 当 isConcurrent=false 时，顶人下线的范围 (CURR_DEVICE_TYPE=当前指定的设备类型端 ALL_DEVICE_TYPE=所有设备类型端)
     *
     * @param replacedRange /
     * @return 对象自身
     */
    setReplacedRange(replacedRange) {
        this.replacedRange = replacedRange;
        return this;
    }

    /**
    * 获取 溢出 maxLoginCount 的客户端，将以何种方式注销下线 (LOGOUT=注销下线, KICKOUT=踢人下线, REPLACED=顶人下线)
    *
    * @return /
    */
    getOverflowLogoutMode() {
        return this.overflowLogoutMode;
    }

    /**
     * 设置 溢出 maxLoginCount 的客户端，将以何种方式注销下线 (LOGOUT=注销下线, KICKOUT=踢人下线, REPLACED=顶人下线)
     *
     * @param overflowLogoutMode /
     * @return 对象自身
     */
    setOverflowLogoutMode(overflowLogoutMode) {
        this.overflowLogoutMode = overflowLogoutMode;
        return this;
    }

    /**
     * 获取 注销范围 (TOKEN=只注销当前 token 的会话，ACCOUNT=注销当前 token 指向的 loginId 其所有客户端会话)  <br> (此参数只在调用 StpUtil.logout() 时有效)
     *
     * @return /
     */
    getLogoutRange() {
        return this.logoutRange;
    }

    /**
     * 设置 注销范围 (TOKEN=只注销当前 token 的会话，ACCOUNT=注销当前 token 指向的 loginId 其所有客户端会话)  <br> (此参数只在调用 StpUtil.logout() 时有效)
     *
     * @param logoutRange /
     * @return 对象自身
     */
    setLogoutRange(logoutRange) {
        this.logoutRange = logoutRange;
        return this;
    }

    /**
     * 获取 如果 token 已被冻结，是否保留其操作权 (是否允许此 token 调用注销API)  <br> (此参数只在调用 StpUtil.[logoutkickoutreplaced]ByTokenValue("token") 时有效)
     *
     * @return isLogoutKeepFreezeOps /
     */
    getIsLogoutKeepFreezeOps() {
        return this.isLogoutKeepFreezeOps;
    }

    /**
     * 设置 如果 token 已被冻结，是否保留其操作权 (是否允许此 token 调用注销API)  <br> (此参数只在调用 StpUtil.[logoutkickoutreplaced]ByTokenValue("token") 时有效)
     *
     * @param isLogoutKeepFreezeOps /
     * @return 对象自身
     */
    setIsLogoutKeepFreezeOps(isLogoutKeepFreezeOps) {
        this.isLogoutKeepFreezeOps = isLogoutKeepFreezeOps;
        return this;
    }

    /**
     * 获取 在注销 token 后，是否保留其对应的 Token-Session
     *
     * @return isLogoutKeepTokenSession /
     */
    getIsLogoutKeepTokenSession() {
        return this.isLogoutKeepTokenSession;
    }

    /**
     * 设置 在注销 token 后，是否保留其对应的 Token-Session
     *
     * @param isLogoutKeepTokenSession /
     * @return 对象自身
     */
    setIsLogoutKeepTokenSession(isLogoutKeepTokenSession) {
        this.isLogoutKeepTokenSession = isLogoutKeepTokenSession;
        return this;
    }

    /**
     * 获取 在登录时，是否立即创建对应的 Token-Session （true=在登录时立即创建，false=在第一次调用 getTokenSession() 时创建）
     *
     * @return /
     */
    getRightNowCreateTokenSession() {
        return this.rightNowCreateTokenSession;
    }

    /**
     * 设置 在登录时，是否立即创建对应的 Token-Session （true=在登录时立即创建，false=在第一次调用 getTokenSession() 时创建）
     *
     * @param rightNowCreateTokenSession /
     * @return 对象自身
     */
    setRightNowCreateTokenSession(rightNowCreateTokenSession) {
        this.rightNowCreateTokenSession = rightNowCreateTokenSession;
        return this;
    }

    /**
     * @return Cookie 全局配置对象
     */
    getCookie() {
        return this.cookie;
    }

    /**
     * @param cookie Cookie 全局配置对象
     * @return 对象自身 
     */
    setCookie(cookie) {
        this.cookie = cookie;
        return this;
    }

    /**
     * 转换为字符串表示。
     * @returns {string} 对象的字符串表示
     */
    toString() {
        return `SaTokenConfig [tokenName=${this.tokenName}, timeout=${this.timeout}, activeTimeout=${this.activeTimeout}, dynamicActiveTimeout=${this.dynamicActiveTimeout}, isConcurrent=${this.isConcurrent}, isShare=${this.isShare}, replacedRange=${this.replacedRange}, maxLoginCount=${this.maxLoginCount}, overflowLogoutMode=${this.overflowLogoutMode}, maxTryTimes=${this.maxTryTimes}, isReadBody=${this.isReadBody}, isReadHeader=${this.isReadHeader}, isReadCookie=${this.isReadCookie}, isLastingCookie=${this.isLastingCookie}, isWriteHeader=${this.isWriteHeader}, logoutRange=${this.logoutRange}, isLogoutKeepFreezeOps=${this.isLogoutKeepFreezeOps}, isLogoutKeepTokenSession=${this.isLogoutKeepTokenSession}, rightNowCreateTokenSession=${this.rightNowCreateTokenSession}, tokenStyle=${this.tokenStyle}, dataRefreshPeriod=${this.dataRefreshPeriod}, tokenSessionCheckLogin=${this.tokenSessionCheckLogin}, autoRenew=${this.autoRenew}, tokenPrefix=${this.tokenPrefix}, cookieAutoFillPrefix=${this.cookieAutoFillPrefix}, isPrint=${this.isPrint}, isLog=${this.isLog}, logLevel=${this.logLevel}, logLevelInt=${this.logLevelInt}, isColorLog=${this.isColorLog}, jwtSecretKey=${this.jwtSecretKey}, httpBasic=${this.httpBasic}, httpDigest=${this.httpDigest}, currDomain=${this.currDomain}, sameTokenTimeout=${this.sameTokenTimeout}, checkSameToken=${this.checkSameToken}, cookie=${this.cookie}]`;
    }

    // ------------------- 过期方法 -------------------

    /**
     * <h2> 请更改为 getActiveTimeout() </h2>
     * @return token 最低活跃频率（单位：秒），如果 token 超过此时间没有访问系统就会被冻结，默认-1 代表不限制，永不冻结
     * 							（例如可以设置为 1800 代表 30 分钟内无操作就冻结）
     */
    // 以下为废弃方法
    /** @deprecated */
    getActivityTimeout() {
        console.warn("配置项已过期，请更换：sa-token.activity-timeout -> sa-token.active-timeout");
        return this.activeTimeout;
    }

    /**
     * <h2> 请更改为 setActiveTimeout() </h2>
     * @param activityTimeout token 最低活跃频率（单位：秒），如果 token 超过此时间没有访问系统就会被冻结，默认-1 代表不限制，永不冻结
     * 								（例如可以设置为 1800 代表 30 分钟内无操作就冻结）
     * @return 对象自身
     */
    /** @deprecated */
    setActivityTimeout(activityTimeout) {
        console.warn("配置项已过期，请更换：sa-token.activity-timeout -> sa-token.active-timeout");
        this.activeTimeout = activityTimeout;
        return this;
    }

    /**
     * <h2> 请更改为 getHttpBasic() </h2>
     * @return Http Basic 认证的默认账号和密码
     */
    /** @deprecated */
    getBasic() {
        return this.httpBasic;
    }

    /**
     * <h2> 请更改为 setHttpBasic() </h2>
     * @param basic Http Basic 认证的默认账号和密码
     * @return 对象自身
     */
    /** @deprecated */
    setBasic(basic) {
        this.httpBasic = basic;
        return this;
    }
}


export default SaTokenConfig;