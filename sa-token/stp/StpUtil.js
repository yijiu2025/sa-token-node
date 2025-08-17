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

import SaManager from '../SaManager.js';
import SaFunction from '../fun/SaFunction.js';
import SaTwoParamFunction from '../fun/SaTwoParamFunction.js';
import SaTokenEventCenter from '../listener/SaTokenEventCenter.js';
import SaSession from '../session/SaSession.js';
import SaTerminalInfo from '../session/SaTerminalInfo.js';
import SaLoginParameter from './parameter/SaLoginParameter.js';
import SaLogoutParameter from './parameter/SaLogoutParameter.js';
import StpLogic from './StpLogic.js';
/**
 * Sa-Token 权限认证工具类
 *
 * @author click33
 * @since 1.0.0
 */
class StpUtil {
	
	// constructor() {
    //     throw new Error("StpUtil is a static class and cannot be instantiated");
    // }
	/**
	 * 多账号体系下的类型标识
	 */
	static TYPE = "login";

	/**
	 * 底层使用的 StpLogic 对象
	 */
	static stpLogic = new StpLogic(this.TYPE);

	/**
	 * 获取当前 StpLogic 的账号类型
	 *
	 * @return {String} /
	 */
	static getLoginType(){
		return this.stpLogic.getLoginType();
	}

	/**
	 * 安全的重置 StpLogic 对象
	 *
	 * <br> 1、更改此账户的 StpLogic 对象 
	 * <br> 2、put 到全局 StpLogic 集合中 
	 * <br> 3、发送日志 
	 * 
	 * @param {StpLogic} newStpLogic / 
	 */
	static setStpLogic(newStpLogic) {
		// 1、重置此账户的 StpLogic 对象
		this.stpLogic = newStpLogic;

		// 2、添加到全局 StpLogic 集合中
		//    以便可以通过 SaManager.getStpLogic(type) 的方式来全局获取到这个 StpLogic
		SaManager.putStpLogic(newStpLogic);
		
		// 3、$$ 发布事件：更新了 stpLogic 对象
		SaTokenEventCenter.doSetStpLogic(this.stpLogic);
	}

	/**
	 * 获取 StpLogic 对象
	 *
	 * @return {StpLogic} / 
	 */
	static getStpLogic() {
		return this.stpLogic;
	}
	
	
	// ------------------- 获取 token 相关 -------------------

	/**
	 * 返回 token 名称，此名称在以下地方体现：Cookie 保存 token 时的名称、提交 token 时参数的名称、存储 token 时的 key 前缀
	 *
	 * @return {String} /
	 */
	static getTokenName() {
 		return this.stpLogic.getTokenName();
 	}

	// /**
	//  * 在当前会话写入指定 token 值
	//  *
	//  * @param {String} tokenValue token 值
	//  */
	// static setTokenValue(tokenValue){
	// 	this.stpLogic.setTokenValue(tokenValue);
	// }

	/**
	 * 在当前会话写入指定 token 值
	 *
	 * @param {String} tokenValue token 值
	 * @param {int | SaLoginParameter} cookieTimeout | loginParameter Cookie存活时间(秒) | 登录参数
	 */
	static setTokenValue(tokenValue, cookieTimeoutOrLoginParameter){
		this.stpLogic.setTokenValue(tokenValue, cookieTimeoutOrLoginParameter);
	}

	// /**
	//  * 在当前会话写入指定 token 值
	//  *
	//  * @param {String} tokenValue token 值
	//  * @param {SaLoginParameter} loginParameter 登录参数
	//  */
	// static setTokenValue(tokenValue, loginParameter){
	// 	this.stpLogic.setTokenValue(tokenValue, loginParameter);
	// }

	/**
	 * 将 token 写入到当前请求的 Storage 存储器里
	 *
	 * @param {String} tokenValue 要保存的 token 值
	 */
	static setTokenValueToStorage(tokenValue){
		this.stpLogic.setTokenValueToStorage(tokenValue);
	}

	/**
	 * 获取当前请求的 token 值
	 *
	 * @return {String} 当前tokenValue
	 */
	static getTokenValue() {
		return this.stpLogic.getTokenValue();
	}

	/**
	 * 获取当前请求的 token 值 （不裁剪前缀）
	 *
	 * @return {String} / 
	 */
	static getTokenValueNotCut(){
		return this.stpLogic.getTokenValueNotCut();
	}

	/**
	 * 获取当前会话的 token 参数信息
	 *
	 * @return {SaTokenInfo} token 参数信息
	 */
	static getTokenInfo() {
		return this.stpLogic.getTokenInfo();
	}

	
	// ------------------- 登录相关操作 -------------------

	// --- 登录 


	/**
     * 会话登录（支持多种参数模式）
     *
     * @param {Object} id 账号id，建议的类型：（long | int | String）
     * @param {String|boolean|number|SaLoginParameter} [arg] 可选参数：设备类型/是否记住我/token有效期/SaLoginParameter
     */
	static login(id, arg) {
		this.stpLogic.login(id, arg);
	}



	// /**
	//  * 会话登录
	//  *
	//  * @param {Object} id 账号id，建议的类型：（long | int | String）
	//  */
	// static login(id) {
	// 	this.stpLogic.login(id);
	// }

	// /**
	//  * 会话登录，并指定登录设备类型
	//  *
	//  * @param {Object} id 账号id，建议的类型：（long | int | String）
	//  * @param {String} deviceType 设备类型
	//  */
	// static login(id, deviceType) {
	// 	this.stpLogic.login(id, deviceType);
	// }

	// /**
	//  * 会话登录，并指定是否 [记住我]
	//  *
	//  * @param {Object} id 账号id，建议的类型：（long | int | String）
	//  * @param {boolean} isLastingCookie 是否为持久Cookie，值为 true 时记住我，值为 false 时关闭浏览器需要重新登录
	//  */
	// static login(id, isLastingCookie) {
	// 	this.stpLogic.login(id, isLastingCookie);
	// }

	// /**
	//  * 会话登录，并指定此次登录 token 的有效期, 单位:秒
	//  *
	//  * @param {Object} id      账号id，建议的类型：（long | int | String）
	//  * @param {long} timeout 此次登录 token 的有效期, 单位:秒
	//  */
	// static login(id, timeout) {
	// 	this.stpLogic.login(id, timeout);
	// }

	// /**
	//  * 会话登录，并指定所有登录参数 Model
	//  *
	//  * @param {Object} id 账号id，建议的类型：（| int | String）
	//  * @param {SaLoginParameter} loginParameter 此次登录的参数Model
	//  */
	// static login(id, loginParameter) {
	// 	this.stpLogic.login(id, loginParameter);
	// }

	// /**
	//  * 创建指定账号 id 的登录会话数据
	//  *
	//  * @param {Object} id 账号id，建议的类型：（long | int | String）
	//  * @return {String} 返回会话令牌
	//  */
	// static createLoginSession(id) {
	// 	return this.stpLogic.createLoginSession(id);
	// }

	/**
	 * 创建指定账号 id 的登录会话数据
	 *
	 * @param {Object} id 账号id，建议的类型：（long | int | String）
	 * @param {SaLoginParameter} loginParameter 此次登录的参数Model
	 * @return {String} 返回会话令牌
	 */
	static createLoginSession(id, loginParameter) {
		return this.stpLogic.createLoginSession(id, loginParameter);
	}

	/**
	 * 获取指定账号 id 的登录会话数据，如果获取不到则创建并返回
	 *
	 * @param {Object} id 账号id，建议的类型：（long | int | String）
	 * @return {String} 返回会话令牌
	 */
	static getOrCreateLoginSession(id) {
		return this.stpLogic.getOrCreateLoginSession(id);
	}


	/**
	 * 会话注销方法 - 支持多种注销方式
	 * 
	 * @param {Object|SaLogoutParameter} arg1 账号id或注销参数对象 
	 * @param {String|SaLogoutParameter} [arg2] 设备类型或注销参数对象
	 */

	static logout(arg1, arg2) {
		this.stpLogic.logout(arg1, arg2);
	}

	// --- 注销 (根据 token)

	// /**
	//  * 在当前客户端会话注销
	//  */
	// static logout() {
	// 	this.stpLogic.logout();
	// }

	// /**
	//  * 在当前客户端会话注销，根据注销参数
	//  * @param {SaLogoutParameter} logoutParameter 注销参数
	//  */
	// static logout(logoutParameter) {
	// 	this.stpLogic.logout(logoutParameter);
	// }

	// /**
	//  * 注销下线，根据指定 token
	//  *
	//  * @param {String} tokenValue 指定 token
	//  */
	// static logoutByTokenValue(tokenValue) {
	// 	this.stpLogic.logoutByTokenValue(tokenValue);
	// }

	/**
	 * 注销下线，根据指定 token、注销参数
	 *
	 * @param {String} tokenValue 指定 token
	 * @param {SaLogoutParameter} logoutParameter 注销参数
	 */
	static logoutByTokenValue(tokenValue, logoutParameter) {
		this.stpLogic.logoutByTokenValue(tokenValue, logoutParameter);
	}

	// /**
	//  * 踢人下线，根据指定 token
	//  * <p> 当对方再次访问系统时，会抛出 NotLoginException 异常，场景值=-5 </p>
	//  *
	//  * @param {String} tokenValue 指定 token
	//  */
	// static kickoutByTokenValue(tokenValue) {
	// 	this.stpLogic.kickoutByTokenValue(tokenValue);
	// }

	/**
	 * 踢人下线，根据指定 token、注销参数
	 * <p> 当对方再次访问系统时，会抛出 NotLoginException 异常，场景值=-5 </p>
	 *
	 * @param {String} tokenValue 指定 token
	 * @param {SaLogoutParameter} logoutParameter 注销参数
	 */
	static kickoutByTokenValue(tokenValue, logoutParameter) {
		this.stpLogic.kickoutByTokenValue(tokenValue, logoutParameter);
	}

	// /**
	//  * 顶人下线，根据指定 token
	//  * <p> 当对方再次访问系统时，会抛出 NotLoginException 异常，场景值=-4 </p>
	//  *
	//  * @param {String} tokenValue 指定 token
	//  */
	// static replacedByTokenValue(tokenValue) {
	// 	this.stpLogic.replacedByTokenValue(tokenValue);
	// }

	/**
	 * 顶人下线，根据指定 token、注销参数
	 * <p> 当对方再次访问系统时，会抛出 NotLoginException 异常，场景值=-4 </p>
	 *
	 * @param {String} tokenValue 指定 token
	 * @param {SaLogoutParameter} logoutParameter 注销参数
	 */
	static replacedByTokenValue(tokenValue, logoutParameter) {
		this.stpLogic.replacedByTokenValue(tokenValue, logoutParameter);
	}

	// --- 注销 (根据 loginId)

	// /**
	//  * 会话注销，根据账号id
	//  *
	//  * @param {Object} loginId 账号id
	//  */
	// static logout(loginId) {
	// 	this.stpLogic.logout(loginId);
	// }

	// /**
	//  * 会话注销，根据账号id 和 设备类型
	//  *
	//  * @param {Object} loginId 账号id
	//  * @param {String} deviceType 设备类型 (填 null 代表注销该账号的所有设备类型)
	//  */
	// static logout(loginId, deviceType) {
	// 	this.stpLogic.logout(loginId, deviceType);
	// }

	// /**
	//  * 会话注销，根据账号id 和 注销参数
	//  *
	//  * @param {Object} loginId 账号id
	//  * @param {SaLogoutParameter} logoutParameter 注销参数
	//  */
	// static logout(loginId, logoutParameter) {
	// 	this.stpLogic.logout(loginId, logoutParameter);
	// }


	/**
	 * 踢人下线方法 - 支持多种参数模式
	 * <p> 当对方再次访问系统时，会抛出 NotLoginException 异常，场景值=-5 </p>
	 *
	 * @param {Object} loginId 账号id
	 * @param {String|SaLogoutParameter} [arg] 可选参数：设备类型或注销参数对象
	 */
	static kickout(loginId, arg) {
		this.stpLogic.kickout(loginId, arg);
	}


	// /**
	//  * 踢人下线，根据账号id
	//  * <p> 当对方再次访问系统时，会抛出 NotLoginException 异常，场景值=-5 </p>
	//  *
	//  * @param {Object} loginId 账号id
	//  */
	// static kickout(loginId) {
	// 	this.stpLogic.kickout(loginId);
	// }

	// /**
	//  * 踢人下线，根据账号id 和 设备类型
	//  * <p> 当对方再次访问系统时，会抛出 NotLoginException 异常，场景值=-5 </p>
	//  *
	//  * @param {Object} loginId 账号id
	//  * @param {String} deviceType 设备类型 (填 null 代表踢出该账号的所有设备类型)
	//  */
	// static kickout(loginId, deviceType) {
	// 	this.stpLogic.kickout(loginId, deviceType);
	// }

	// /**
	//  * 踢人下线，根据账号id 和 注销参数
	//  * <p> 当对方再次访问系统时，会抛出 NotLoginException 异常，场景值=-5 </p>
	//  *
	//  * @param {Object} loginId 账号id
	//  * @param {SaLogoutParameter} logoutParameter 注销参数
	//  */
	// static kickout(loginId, logoutParameter) {
	// 	this.stpLogic.kickout(loginId, logoutParameter);
	// }


	/**
	 * 顶人下线方法 - 支持多种参数模式 
	 * <p> 当对方再次访问系统时，会抛出 NotLoginException 异常，场景值=-4 </p>
	 *
	 * @param {Object} loginId 账号id
	 * @param {String|SaLogoutParameter} [arg] 可选参数：设备类型或注销参数对象
	 */
	static replaced(loginId, arg) {
		this.stpLogic.replaced(loginId, arg);
	}


	// /**
	//  * 顶人下线，根据账号id
	//  * <p> 当对方再次访问系统时，会抛出 NotLoginException 异常，场景值=-4 </p>
	//  *
	//  * @param {Object} loginId 账号id
	//  */
	// static replaced(loginId) {
	// 	this.stpLogic.replaced(loginId);
	// }

	// /**
	//  * 顶人下线，根据账号id 和 设备类型
	//  * <p> 当对方再次访问系统时，会抛出 NotLoginException 异常，场景值=-4 </p>
	//  *
	//  * @param {Object} loginId 账号id
	//  * @param {String} deviceType 设备类型 （填 null 代表顶替该账号的所有设备类型）
	//  */
	// static replaced(loginId, deviceType) {
	// 	this.stpLogic.replaced(loginId, deviceType);
	// }

	// /**
	//  * 顶人下线，根据账号id 和 注销参数
	//  * <p> 当对方再次访问系统时，会抛出 NotLoginException 异常，场景值=-4 </p>
	//  *
	//  * @param {Object} loginId 账号id
	//  * @param {SaLogoutParameter} logoutParameter 注销参数
	//  */
	// static replaced(loginId, logoutParameter) {
	// 	this.stpLogic.replaced(loginId, logoutParameter);
	// }

	// --- 注销 (会话管理辅助方法)

	/**
	 * 在 Account-Session 上移除 Terminal 信息 (注销下线方式)
	 * @param {SaSession} session /
	 * @param {SaTerminalInfo} terminal /
	 */
	static removeTerminalByLogout(session, terminal) {
		this.stpLogic.removeTerminalByLogout(session, terminal);
	}

	/**
	 * 在 Account-Session 上移除 Terminal 信息 (踢人下线方式)
	 * @param {SaSession} session /
	 * @param {SaTerminalInfo} terminal /
	 */
	static removeTerminalByKickout(session, terminal) {
		this.stpLogic.removeTerminalByKickout(session, terminal);
	}

	/**
	 * 在 Account-Session 上移除 Terminal 信息 (顶人下线方式)
	 * @param {SaSession} session /
	 * @param {SaTerminalInfo} terminal /
	 */
	static removeTerminalByReplaced(session, terminal) {
		this.stpLogic.removeTerminalByReplaced(session, terminal);
	}


	// 会话查询

	// /**
	//  * 判断当前会话是否已经登录
	//  *
	//  * @return {boolean} 已登录返回 true，未登录返回 false
	//  */
	// static isLogin() {
	// 	return this.stpLogic.isLogin();
	// }

	/**
	 * 判断指定账号是否已经登录
	 * @param {Object} loginId 账号id
	 * @return {boolean} 已登录返回 true，未登录返回 false
	 */
	static isLogin(loginId) {
		return this.stpLogic.isLogin(loginId);
	}

	/**
	 * 检验当前会话是否已经登录，如未登录，则抛出异常
	 */
 	static checkLogin() {
 		this.stpLogic.checkLogin();
 	}

	// /**
	//  * 获取当前会话账号id，如果未登录，则抛出异常
	//  *
	//  * @return {Object} 账号id
	//  */
	// static getLoginId() {
	// 	return this.stpLogic.getLoginId();
	// }

	/**
	 * 获取当前会话账号id, 如果未登录，则返回默认值
	 *
	 * @param {<T>} <T> 返回类型
	 * @param {T} defaultValue 默认值
	 * @return {<T> T} 登录id
	 */
	static getLoginId(defaultValue) {
		return this.stpLogic.getLoginId(defaultValue);
	}

	/**
	 * 获取当前会话账号id, 如果未登录，则返回null
	 *
	 * @return {Object} 账号id
	 */
	static getLoginIdDefaultNull() {
		return this.stpLogic.getLoginIdDefaultNull();
 	}

	/**
	 * 获取当前会话账号id, 并转换为 String 类型
	 *
	 * @return {String} 账号id
	 */
	static getLoginIdAsString() {
		return this.stpLogic.getLoginIdAsString();
	}

	/**
	 * 获取当前会话账号id, 并转换为 int 类型
	 *
	 * @return {int} 账号id
	 */
	static getLoginIdAsInt() {
		return this.stpLogic.getLoginIdAsInt();
	}

	/**
	 * 获取当前会话账号id, 并转换为 long 类型
	 *
	 * @return {long} 账号id
	 */
	static getLoginIdAsLong() {
		return this.stpLogic.getLoginIdAsLong();
	}

	/**
	 * 获取指定 token 对应的账号id，如果 token 无效或 token 处于被踢、被顶、被冻结等状态，则返回 null
	 *
	 * @param {String} tokenValue token
	 * @return {Object} 账号id
	 */
 	static getLoginIdByToken(tokenValue) {
 		return this.stpLogic.getLoginIdByToken(tokenValue);
 	}

	/**
	 * 获取指定 token 对应的账号id，如果 token 无效或 token 处于被踢、被顶等状态 (不考虑被冻结)，则返回 null
	 *
	 * @param {String} tokenValue token
	 * @return {Object} 账号id
	 */
	static getLoginIdByTokenNotThinkFreeze(tokenValue) {
		return this.stpLogic.getLoginIdByTokenNotThinkFreeze(tokenValue);
	}

	// /**
	//  * 获取当前 Token 的扩展信息（此函数只在jwt模式下生效）
	//  *
	//  * @param {String} key 键值
	//  * @return {Object} 对应的扩展数据
	//  */
	// static getExtra(key) {
	// 	return this.stpLogic.getExtra(key);
	// }

	/**
	 * 获取指定 Token 的扩展信息（此函数只在jwt模式下生效）
	 *
	 * @param {String} tokenValue  | key 指定的 Token 值
	 * @param {String} key 键值
	 * @return {Object} 对应的扩展数据
	 */
	static getExtra(tokenValueOrKey, key) {
		return this.stpLogic.getExtra(tokenValueOrKey, key);
	}
 	
 	
	// ------------------- Account-Session 相关 -------------------

	/**
	 * 获取指定账号 id 的 Account-Session, 如果该 SaSession 尚未创建，isCreate=是否新建并返回
	 *
	 * @param {Object} loginId 账号id
	 * @param {boolean} isCreate 是否新建
	 * @return {SaSession} SaSession 对象
	 */
	static getSessionByLoginId(loginId, isCreate) {
		return this.stpLogic.getSessionByLoginId(loginId, isCreate);
	}

	/**
	 * 获取指定 key 的 SaSession, 如果该 SaSession 尚未创建，则返回 null
	 *
	 * @param {String} sessionId SessionId
	 * @return {SaSession} Session对象
	 */
	static getSessionBySessionId(sessionId) {
		return this.stpLogic.getSessionBySessionId(sessionId);
	}

	// /**
	//  * 获取指定账号 id 的 Account-Session，如果该 SaSession 尚未创建，则新建并返回
	//  *
	//  * @param {Object} loginId 账号id
	//  * @return {SaSession} SaSession 对象
	//  */
	// static getSessionByLoginId(loginId) {
	// 	return this.stpLogic.getSessionByLoginId(loginId);
	// }

	/**
	 * 获取当前已登录账号的 Account-Session, 如果该 SaSession 尚未创建，isCreate=是否新建并返回
	 *
	 * @param {boolean} isCreate 是否新建
	 * @return {SaSession} Session对象
	 */
	static getSession(isCreate) {
		return this.stpLogic.getSession(isCreate);
	}

	// /**
	//  * 获取当前已登录账号的 Account-Session，如果该 SaSession 尚未创建，则新建并返回
	//  *
	//  * @return {SaSession} Session对象
	//  */
	// static getSession() {
	// 	return this.stpLogic.getSession();
	// }

	
	// ------------------- Token-Session 相关 -------------------  

	/**
	 * 获取指定 token 的 Token-Session，如果该 SaSession 尚未创建，则新建并返回
	 *
	 * @param {String} tokenValue Token值
	 * @return {SaSession} Session对象
	 */
	static getTokenSessionByToken(tokenValue) {
		return this.stpLogic.getTokenSessionByToken(tokenValue);
	}

	/**
	 * 获取当前 token 的 Token-Session，如果该 SaSession 尚未创建，则新建并返回
	 *
	 * @return {SaSession} Session对象
	 */
	static getTokenSession() {
		return this.stpLogic.getTokenSession();
	}

	/**
	 * 获取当前匿名 Token-Session （可在未登录情况下使用的Token-Session）
	 *
	 * @return {SaSession} Token-Session 对象
	 */
	static getAnonTokenSession() {
		return this.stpLogic.getAnonTokenSession();
	}
	

	// ------------------- Active-Timeout token 最低活跃度 验证相关 -------------------

	/**
	 * 续签当前 token：(将 [最后操作时间] 更新为当前时间戳)
	 * <h2>
	 * 		请注意: 即使 token 已被冻结 也可续签成功，
	 * 		如果此场景下需要提示续签失败，可在此之前调用 checkActiveTimeout() 强制检查是否冻结即可
	 * </h2>
	 */
	static updateLastActiveToNow() {
		this.stpLogic.updateLastActiveToNow();
	}

	/**
	 * 检查当前 token 是否已被冻结，如果是则抛出异常
	 */
 	static checkActiveTimeout() {
 		this.stpLogic.checkActiveTimeout();
 	}

	/**
	 * 获取当前 token 的最后活跃时间（13位时间戳），如果不存在则返回 -2
	 *
	 * @return {long} /
	 */
	static getTokenLastActiveTime() {
		return this.stpLogic.getTokenLastActiveTime();
	}


	// ------------------- 过期时间相关 -------------------  

	// /**
	//  * 获取当前会话 token 剩余有效时间（单位: 秒，返回 -1 代表永久有效，-2 代表没有这个值）
	//  *
	//  * @return {long} token剩余有效时间
	//  */
 	// static getTokenTimeout() {
 	// 	return this.stpLogic.getTokenTimeout();
 	// }

	/**
	 * 获取指定 token 剩余有效时间（单位: 秒，返回 -1 代表永久有效，-2 代表没有这个值）
	 *
	 * @param {String} token 指定token
	 * @return {long} token剩余有效时间
	 */
	static getTokenTimeout(token) {
		return this.stpLogic.getTokenTimeout(token);
	}

	/**
	 * 获取当前登录账号的 Account-Session 剩余有效时间（单位: 秒，返回 -1 代表永久有效，-2 代表没有这个值）
	 *
	 * @return {long} token剩余有效时间
	 */
 	static getSessionTimeout() {
 		return this.stpLogic.getSessionTimeout();
 	}

	/**
	 * 获取当前 token 的 Token-Session 剩余有效时间（单位: 秒，返回 -1 代表永久有效，-2 代表没有这个值）
	 *
	 * @return {long} token剩余有效时间
	 */
 	static getTokenSessionTimeout() {
 		return this.stpLogic.getTokenSessionTimeout();
 	}

	/**
	 * 获取当前 token 剩余活跃有效期：当前 token 距离被冻结还剩多少时间（单位: 秒，返回 -1 代表永不冻结，-2 代表没有这个值或 token 已被冻结了）
	 *
	 * @return {long} /
	 */
 	static getTokenActiveTimeout() {
 		return this.stpLogic.getTokenActiveTimeout();
 	}

	// /**
	//  * 对当前 token 的 timeout 值进行续期
	//  *
	//  * @param {long} timeout 要修改成为的有效时间 (单位: 秒)
	//  */
 	// static renewTimeout(timeout) {
 	// 	this.stpLogic.renewTimeout(timeout);
 	// }

	/**
	 * 对指定 token 的 timeout 值进行续期
	 *
	 * @param {String | long} tokenValueOrTimeout 指定 token
	 * @param {long} timeout 要修改成为的有效时间 (单位: 秒，填 -1 代表要续为永久有效)
	 */
 	static renewTimeout(tokenValueOrTimeout, timeout) {
 		this.stpLogic.renewTimeout(tokenValueOrTimeout, timeout);
 	}
 	
 	
	// ------------------- 角色认证操作 -------------------

	// /**
	//  * 获取：当前账号的角色集合
	//  *
	//  * @return {List<String>} /
	//  */
	// static getRoleList() {
	// 	return this.stpLogic.getRoleList();
	// }

	/**
	 * 获取：指定账号的角色集合
	 *
	 * @param {Object} loginId 指定账号id
	 * @return {List<String>} /
	 */
	static getRoleList(loginId) {
		return this.stpLogic.getRoleList(loginId);
	}

	// /**
	//  * 判断：当前账号是否拥有指定角色, 返回 true 或 false
	//  *
	//  * @param {String} role 角色
	//  * @return {boolean} /
	//  */
 	// static hasRole(role) {
 	// 	return this.stpLogic.hasRole(role);
 	// }

	/**
	 * 判断：指定账号是否含有指定角色标识, 返回 true 或 false
	 *
	 * @param {Object | String} loginIdOrRole 账号id | 角色
	 * @param {String} role 角色标识
	 * @return {boolean} 是否含有指定角色标识
	 */
 	static hasRole(loginIdOrRole, role) {
 		return this.stpLogic.hasRole(loginIdOrRole, role);
 	}

	/**
	 * 判断：当前账号是否含有指定角色标识 [ 指定多个，必须全部验证通过 ]
	 *
	 * @param {String[]} roleArray 角色标识数组
	 * @return {boolean} true或false
	 */
 	static hasRoleAnd(...roleArray){
 		return this.stpLogic.hasRoleAnd(...roleArray);
 	}

	/**
	 * 判断：当前账号是否含有指定角色标识 [ 指定多个，只要其一验证通过即可 ]
	 *
	 * @param {String[]} roleArray 角色标识数组
	 * @return {boolean} true或false
	 */
 	static hasRoleOr(...roleArray){
 		return this.stpLogic.hasRoleOr(...roleArray);
 	}

	/**
	 * 校验：当前账号是否含有指定角色标识, 如果验证未通过，则抛出异常: NotRoleException
	 *
	 * @param {String} role 角色标识
	 */
 	static checkRole(role) {
 		this.stpLogic.checkRole(role);
 	}

	/**
	 * 校验：当前账号是否含有指定角色标识 [ 指定多个，必须全部验证通过 ]
	 *
	 * @param {String...} roleArray 角色标识数组
	 */
 	static checkRoleAnd(...roleArray){
 		this.stpLogic.checkRoleAnd(...roleArray);
 	}

	/**
	 * 校验：当前账号是否含有指定角色标识 [ 指定多个，只要其一验证通过即可 ]
	 *
	 * @param {String...} roleArray 角色标识数组
	 */
 	static checkRoleOr(...roleArray){
 		this.stpLogic.checkRoleOr(...roleArray);
 	}

	
	// ------------------- 权限认证操作 -------------------

	// /**
	//  * 获取：当前账号的权限码集合
	//  *
	//  * @return {List<String>} /
	//  */
	// static getPermissionList() {
	// 	return this.stpLogic.getPermissionList();
	// }

	/**
	 * 获取：指定账号的权限码集合
	 *
	 * @param {Object} loginId 指定账号id
	 * @return {List<String>} /
	 */
	static getPermissionList(loginId) {
		return this.stpLogic.getPermissionList(loginId);
	}

	// /**
	//  * 判断：当前账号是否含有指定权限, 返回 true 或 false
	//  *
	//  * @param {String} permission 权限码
	//  * @return {boolean} 是否含有指定权限
	//  */
	// static hasPermission(permission) {
	// 	return this.stpLogic.hasPermission(permission);
	// }

	/**
	 * 判断：指定账号 id 是否含有指定权限, 返回 true 或 false
	 *
	 * @param {Object | String} loginIdOrPermission 账号 id | 权限码
	 * @param {String} permission 权限码
	 * @return {boolean} 是否含有指定权限
	 */
	static hasPermission(loginIdOrPermission, permission) {
		return this.stpLogic.hasPermission(loginIdOrPermission, permission);
	}

	/**
	 * 判断：当前账号是否含有指定权限 [ 指定多个，必须全部具有 ]
	 *
	 * @param {String...} permissionArray 权限码数组
	 * @return {boolean} true 或 false
	 */
 	static hasPermissionAnd(...permissionArray){
 		return this.stpLogic.hasPermissionAnd(...permissionArray);
 	}

	/**
	 * 判断：当前账号是否含有指定权限 [ 指定多个，只要其一验证通过即可 ]
	 *
	 * @param {String...} permissionArray 权限码数组
	 * @return {boolean} true 或 false
	 */
 	static hasPermissionOr(...permissionArray){
 		return this.stpLogic.hasPermissionOr(...permissionArray);
 	}

	/**
	 * 校验：当前账号是否含有指定权限, 如果验证未通过，则抛出异常: NotPermissionException
	 *
	 * @param {String} permission 权限码
	 */
	static checkPermission(permission) {
		this.stpLogic.checkPermission(permission);
	}

	/**
	 * 校验：当前账号是否含有指定权限 [ 指定多个，必须全部验证通过 ]
	 *
	 * @param {String...} permissionArray 权限码数组
	 */
	static checkPermissionAnd(...permissionArray) {
		this.stpLogic.checkPermissionAnd(...permissionArray);
	}

	/**
	 * 校验：当前账号是否含有指定权限 [ 指定多个，只要其一验证通过即可 ]
	 *
	 * @param {String...} permissionArray 权限码数组
	 */
	static checkPermissionOr(...permissionArray) {
		this.stpLogic.checkPermissionOr(...permissionArray);
	}


	// ------------------- id 反查 token 相关操作 -------------------

	// /**
	//  * 获取指定账号 id 的 token
	//  * <p>
	//  * 		在配置为允许并发登录时，此方法只会返回队列的最后一个 token，
	//  * 		如果你需要返回此账号 id 的所有 token，请调用 getTokenValueListByLoginId
	//  * </p>
	//  *
	//  * @param {Object} loginId 账号id
	//  * @return {String} token值
	//  */
	// static getTokenValueByLoginId(loginId) {
	// 	return this.stpLogic.getTokenValueByLoginId(loginId);
	// }

	/**
	 * 获取指定账号 id 指定设备类型端的 token
	 * <p>
	 * 		在配置为允许并发登录时，此方法只会返回队列的最后一个 token，
	 * 		如果你需要返回此账号 id 的所有 token，请调用 getTokenValueListByLoginId
	 * </p>
	 *
	 * @param {Object} loginId 账号id
	 * @param {String} deviceType 设备类型，填 null 代表不限设备类型
	 * @return {String} token值
	 */
	static getTokenValueByLoginId(loginId, deviceType) {
		return this.stpLogic.getTokenValueByLoginId(loginId, deviceType);
	}

	// /**
	//  * 获取指定账号 id 的 token 集合
	//  *
	//  * @param {Object} loginId 账号id
	//  * @return {List<String>} 此 loginId 的所有相关 token
	//  */
	// static getTokenValueListByLoginId(loginId) {
	// 	return this.stpLogic.getTokenValueListByLoginId(loginId);
	// }

	/**
	 * 获取指定账号 id 指定设备类型端的 token 集合
	 *
	 * @param {Object} loginId 账号id
	 * @param {String} deviceType 设备类型，填 null 代表不限设备类型
	 * @return {List<String>} 此 loginId 的所有登录 token
	 */
	static getTokenValueListByLoginId(loginId, deviceType) {
		return this.stpLogic.getTokenValueListByLoginId(loginId, deviceType);
	}

	// /**
	//  * 获取指定账号 id 已登录设备信息集合
	//  *
	//  * @param {Object} loginId 账号id
	//  * @return {List<SaTerminalInfo>} 此 loginId 的所有登录 token
	//  */
	// static getTerminalListByLoginId(loginId) {
	// 	return this.stpLogic.getTerminalListByLoginId(loginId);
	// }

	/**
	 * 获取指定账号 id 指定设备类型端的已登录设备信息集合
	 *
	 * @param {Object} loginId 账号id
	 * @param {String} deviceType 设备类型，填 null 代表不限设备类型
	 * @return {List<SaTerminalInfo>} 此 loginId 的所有登录设备信息
	 */
	static getTerminalListByLoginId(loginId, deviceType) {
		return this.stpLogic.getTerminalListByLoginId(loginId, deviceType);
	}

	/**
	 * 获取指定账号 id 已登录设备信息集合，执行特定函数
	 *
	 * @param {Object} loginId 账号id
	 * @param {SaTwoParamFunction<SaSession, SaTerminalInfo>} function 需要执行的函数
	 */
	static forEachTerminalList(loginId, func) {
		this.stpLogic.forEachTerminalList(loginId, func);
	}

	/**
	 * 返回当前 token 指向的 SaTerminalInfo 设备信息，如果 token 无效则返回 null
	 *
	 * @return {SaTerminalInfo} /
	 */
	static getTerminalInfo() {
		return this.stpLogic.getTerminalInfo();
	}

	/**
	 * 返回指定 token 指向的 SaTerminalInfo 设备信息，如果 Token 无效则返回 null
	 *
	 * @param {String} tokenValue 指定 token
	 * @return {SaTerminalInfo} /
	 */
	static getTerminalInfoByToken(tokenValue) {
		return this.stpLogic.getTerminalInfoByToken(tokenValue);
	}

	/**
	 * 返回当前会话的登录设备类型
	 *
	 * @return {String} 当前令牌的登录设备类型
	 */
	static getLoginDeviceType() {
		return this.stpLogic.getLoginDeviceType();
	}

	/**
	 * 返回指定 token 会话的登录设备类型
	 *
	 * @param {String} tokenValue 指定token
	 * @return {String} 当前令牌的登录设备类型
	 */
	static getLoginDeviceTypeByToken(tokenValue) {
		return this.stpLogic.getLoginDeviceTypeByToken(tokenValue);
	}

	/**
	 * 返回当前会话的登录设备 ID
	 *
	 * @return {String} /
	 */
	static getLoginDeviceId() {
		return this.stpLogic.getLoginDeviceId();
	}

	/**
	 * 返回指定 token 会话的登录设备 ID
	 *
	 * @param {String} tokenValue 指定token
	 * @return {String} /
	 */
	static getLoginDeviceIdByToken(tokenValue) {
		return this.stpLogic.getLoginDeviceIdByToken(tokenValue);
	}

	/**
	 * 判断对于指定 loginId 来讲，指定设备 id 是否为可信任设备
	 * @param {Object} userId 账号id
	 * @param {String} deviceId /
	 * @return {boolean} /
	 */
	static isTrustDeviceId(userId, deviceId) {
		return this.stpLogic.isTrustDeviceId(userId, deviceId);
	}



	// ------------------- 会话管理 -------------------  

	/**
	 * 根据条件查询缓存中所有的 token
	 *
	 * @param {String} keyword 关键字
	 * @param {int} start 开始处索引
	 * @param {int} size 获取数量 (-1代表一直获取到末尾)
	 * @param {boolean} sortType 排序类型（true=正序，false=反序）
	 *
	 * @return {List<String>} token集合
	 */
	static searchTokenValue(keyword, start, size, sortType) {
		return this.stpLogic.searchTokenValue(keyword, start, size, sortType);
	}

	/**
	 * 根据条件查询缓存中所有的 SessionId
	 *
	 * @param {String} keyword 关键字
	 * @param {int} start 开始处索引
	 * @param {int} size 获取数量  (-1代表一直获取到末尾)
	 * @param {boolean} sortType 排序类型（true=正序，false=反序）
	 *
	 * @return {List<String>} sessionId集合
	 */
	static searchSessionId(keyword, start, size, sortType) {
		return this.stpLogic.searchSessionId(keyword, start, size, sortType);
	}

	/**
	 * 根据条件查询缓存中所有的 Token-Session-Id
	 *
	 * @param {String} keyword 关键字
	 * @param {int} start 开始处索引
	 * @param {int} size 获取数量 (-1代表一直获取到末尾)
	 * @param {boolean} sortType 排序类型（true=正序，false=反序）
	 *
	 * @return {List<String>} sessionId集合
	 */
	static searchTokenSessionId(keyword, start, size, sortType) {
		return this.stpLogic.searchTokenSessionId(keyword, start, size, sortType);
	}

	
	// ------------------- 账号封禁 -------------------  

	// /**
	//  * 封禁：指定账号
	//  * <p> 此方法不会直接将此账号id踢下线，如需封禁后立即掉线，请追加调用 StpUtil.logout(id)
	//  *
	//  * @param {Object} loginId 指定账号id
	//  * @param {long} time 封禁时间, 单位: 秒 （-1=永久封禁）
	//  */
	// static disable(loginId, time) {
	// 	this.stpLogic.disable(loginId, time);
	// }

	// /**
	//  * 判断：指定账号是否已被封禁 (true=已被封禁, false=未被封禁) 
	//  *
	//  * @param {Object} loginId 账号id
	//  * @return {boolean} /
	//  */
	// static isDisable(loginId) {
	// 	return this.stpLogic.isDisable(loginId);
	// }

	// /**
	//  * 校验：指定账号是否已被封禁，如果被封禁则抛出异常
	//  *
	//  * @param {Object} loginId 账号id
	//  */
	// static checkDisable(loginId) {
	// 	this.stpLogic.checkDisable(loginId);
	// }

	// /**
	//  * 获取：指定账号剩余封禁时间，单位：秒（-1=永久封禁，-2=未被封禁）
	//  *
	//  * @param {Object} loginId 账号id
	//  * @return {long} /
	//  */
	// static getDisableTime(loginId) {
	// 	return this.stpLogic.getDisableTime(loginId);
	// }

	// /**
	//  * 解封：指定账号
	//  *
	//  * @param {Object} loginId 账号id
	//  */
	// static untieDisable(loginId) {
	// 	this.stpLogic.untieDisable(loginId);
	// }

	
	// ------------------- 分类封禁 -------------------  

	/**
	 * 封禁：指定账号的指定服务 
	 * <p> 此方法不会直接将此账号id踢下线，如需封禁后立即掉线，请追加调用 StpUtil.logout(id)
	 *
	 * @param {Object} loginId  指定账号id
	 * @param {String | long} serviceOrTime  指定服务 | 封禁时间, 单位: 秒 （-1=永久封禁）
	 * @param {long} time 封禁时间, 单位: 秒 （-1=永久封禁）
	 */
	static disable(loginId, serviceOrTime, time) {
		this.stpLogic.disable(loginId, serviceOrTime, time);
	}

	/**
	 * 判断：指定账号的指定服务 是否已被封禁（true=已被封禁, false=未被封禁）
	 *
	 * @param {Object} loginId 账号id
	 * @param {String} service 指定服务
	 * @return {boolean} /
	 */
	static isDisable(loginId, service) {
		return this.stpLogic.isDisable(loginId, service);
	}

	/**
	 * 校验：指定账号 指定服务 是否已被封禁，如果被封禁则抛出异常
	 *
	 * @param {Object} loginId 账号id
	 * @param {String...} services 指定服务，可以指定多个
	 */
	static checkDisable(loginId, ...services) {
		this.stpLogic.checkDisable(loginId, ...services);
	}

	/**
	 * 获取：指定账号 指定服务 剩余封禁时间，单位：秒（-1=永久封禁，-2=未被封禁）
	 *
	 * @param {Object} loginId 账号id
	 * @param {String} service 指定服务
	 * @return {long} /
	 */
	static getDisableTime(loginId, service) {
		return this.stpLogic.getDisableTime(loginId, service);
	}

	/**
	 * 解封：指定账号、指定服务
	 *
	 * @param {Object} loginId 账号id
	 * @param {String...} services 指定服务，可以指定多个
	 */
	static untieDisable(loginId, ...services) {
		this.stpLogic.untieDisable(loginId, ...services);
	}


	// ------------------- 阶梯封禁 -------------------  


	/**
	 * 封禁账号并指定封禁等级 - 支持多种参数模式
	 *
	 * @param {Object} loginId 指定账号id  
	 * @param {String|Number} serviceOrLevel 指定服务名称或封禁等级
	 * @param {Number} levelOrTime 指定封禁等级或封禁时间
	 * @param {Number} [time] 封禁时间(单位：秒,-1=永久封禁)
	 */
	static disableLevel(loginId, serviceOrLevel, levelOrTime, time) {
		this.stpLogic.disableLevel(loginId, serviceOrLevel, levelOrTime, time);
	}
 

	// /**
	//  * 封禁：指定账号，并指定封禁等级
	//  *
	//  * @param {Object} loginId 指定账号id
	//  * @param {int} level 指定封禁等级
	//  * @param {long} time 封禁时间, 单位: 秒 （-1=永久封禁）
	//  */
	// static disableLevel(loginId, level, time) {
	// 	this.stpLogic.disableLevel(loginId, level, time);
	// }

	// /**
	//  * 封禁：指定账号的指定服务，并指定封禁等级
	//  *
	//  * @param {Object} loginId 指定账号id
	//  * @param {String} service 指定封禁服务
	//  * @param {int} level 指定封禁等级
	//  * @param {long} time 封禁时间, 单位: 秒 （-1=永久封禁）
	//  */
	// static disableLevel(loginId, service, level, time) {
	// 	this.stpLogic.disableLevel(loginId, service, level, time);
	// }



	/**
	 * 判断账号是否已被封禁到指定等级
	 * 
	 * @param {Object} loginId 指定账号id
	 * @param {String|Number} serviceOrLevel 指定服务或封禁等级
	 * @param {Number} [level] 指定封禁等级(当第一个参数为服务时使用)
	 * @return {boolean} 是否已被封禁到指定等级
	 */
	static isDisableLevel(loginId, serviceOrLevel, level) {
		return this.stpLogic.isDisableLevel(loginId, serviceOrLevel, level);
	}

	// /**
	//  * 判断：指定账号是否已被封禁到指定等级
	//  *
	//  * @param {Object} loginId 指定账号id
	//  * @param {int} level 指定封禁等级
	//  * @return {boolean} /
	//  */
	// static isDisableLevel(loginId, level) {
	// 	return this.stpLogic.isDisableLevel(loginId, level);
	// }

	// /**
	//  * 判断：指定账号的指定服务，是否已被封禁到指定等级 
	//  *
	//  * @param {Object} loginId 指定账号id
	//  * @param {String} service 指定封禁服务
	//  * @param {int} level 指定封禁等级
	//  * @return {boolean} /
	//  */
	// static isDisableLevel(loginId, service, level) {
	// 	return this.stpLogic.isDisableLevel(loginId, service, level);
	// }


	/**
	 * 校验账号是否已被封禁到指定等级 - 支持多种参数模式
	 * 
	 * @param {Object} loginId 指定账号id
	 * @param {String|Number} serviceOrLevel 指定服务或封禁等级 
	 * @param {Number} [level] 封禁等级(当第一个参数为服务时使用)
	 * @throws {DisableServiceException} 如果已被封禁则抛出异常
	 */
	static checkDisableLevel(loginId, serviceOrLevel, level) {
		this.stpLogic.checkDisableLevel(loginId, serviceOrLevel, level);
	}

	// /**
	//  * 校验：指定账号是否已被封禁到指定等级（如果已经达到，则抛出异常）
	//  *
	//  * @param {Object} loginId 指定账号id
	//  * @param {int} level 封禁等级 （只有 封禁等级 ≥ 此值 才会抛出异常）
	//  */
	// static checkDisableLevel(loginId, level) {
	// 	this.stpLogic.checkDisableLevel(loginId, level);
	// }

	// /**
	//  * 校验：指定账号的指定服务，是否已被封禁到指定等级（如果已经达到，则抛出异常）
	//  *
	//  * @param {Object} loginId 指定账号id
	//  * @param {String} service 指定封禁服务
	//  * @param {int} level 封禁等级 （只有 封禁等级 ≥ 此值 才会抛出异常）
	//  */
	// static checkDisableLevel(loginId, service, level) {
	// 	this.stpLogic.checkDisableLevel(loginId, service, level);
	// }

	// /**
	//  * 获取：指定账号被封禁的等级，如果未被封禁则返回-2 
	//  *
	//  * @param {Object} loginId 指定账号id
	//  * @return {int} /
	//  */
	// static getDisableLevel(loginId) {
	// 	return this.stpLogic.getDisableLevel(loginId);
	// }

	/**
	 * 获取：指定账号的 指定服务 被封禁的等级，如果未被封禁则返回-2 
	 *
	 * @param {Object} loginId 指定账号id 
	 * @param {String} service 指定封禁服务 
	 * @return {int} /
	 */
	static getDisableLevel(loginId, service) {
		return this.stpLogic.getDisableLevel(loginId, service);
	}
	
	
	// ------------------- 临时身份切换 -------------------

	// /**
	//  * 临时切换身份为指定账号id
	//  *
	//  * @param {Object} loginId 指定loginId
	//  */
	// static switchTo(loginId) {
	// 	this.stpLogic.switchTo(loginId);
	// }

	/**
	 * 结束临时切换身份
	 */
	static endSwitch() {
		this.stpLogic.endSwitch();
	}

	/**
	 * 判断当前请求是否正处于 [ 身份临时切换 ] 中
	 *
	 * @return {boolean} /
	 */
	static isSwitch() {
		return this.stpLogic.isSwitch();
	}

	/**
	 * 在一个 lambda 代码段里，临时切换身份为指定账号id，lambda 结束后自动恢复
	 *
	 * @param {Object} loginId 指定账号id
	 * @param {SaFunction} function 要执行的方法
	 */
	static switchTo(loginId, func) {
		this.stpLogic.switchTo(loginId, func);
	}
	

	// ------------------- 二级认证 -------------------  


	/**
	 * 在当前会话开启二级认证 - 支持多种参数模式
	 * 
	 * @param {String|Number} serviceOrSafeTime 业务标识或维持时间(单位:秒)
	 * @param {Number} [safeTime] 维持时间(单位:秒,当第一个参数为业务标识时使用)
	 */
	static openSafe(serviceOrSafeTime, safeTime) {
		this.stpLogic.openSafe(serviceOrSafeTime, safeTime);
	}


	// /**
	//  * 在当前会话 开启二级认证
	//  *
	//  * @param {long} safeTime 维持时间 (单位: 秒) 
	//  */
	// static openSafe(safeTime) {
	// 	this.stpLogic.openSafe(safeTime);
	// }

	// /**
	//  * 在当前会话 开启二级认证
	//  *
	//  * @param {String} service 业务标识
	//  * @param {long} safeTime 维持时间 (单位: 秒)
	//  */
	// static openSafe(service, safeTime) {
	// 	this.stpLogic.openSafe(service, safeTime);
	// }


	/**
	 * 判断当前会话是否处于二级认证时间内 - 支持多种参数模式
	 * 
	 * @param {String} [serviceOrTokenValue] 业务标识
	 * @param {String} [service] Token值(当传入service时可用)
	 * @return {boolean} true=二级认证已通过, false=尚未进行二级认证或认证已超时
	 */
	static isSafe(serviceOrTokenValue, service) {
		return this.stpLogic.isSafe(serviceOrTokenValue, service);
	}


	// /**
	//  * 判断：当前会话是否处于二级认证时间内
	//  *
	//  * @return {boolean} true=二级认证已通过, false=尚未进行二级认证或认证已超时
	//  */
	// static isSafe() {
	// 	return this.stpLogic.isSafe();
	// }

	// /**
	//  * 判断：当前会话 是否处于指定业务的二级认证时间内
	//  *
	//  * @param {String} service 业务标识
	//  * @return {boolean} true=二级认证已通过, false=尚未进行二级认证或认证已超时
	//  */
	// static isSafe(service) {
	// 	return this.stpLogic.isSafe(service);
	// }

	// /**
	//  * 判断：指定 token 是否处于二级认证时间内
	//  *
	//  * @param {String} tokenValue Token 值
	//  * @param {String} service 业务标识
	//  * @return {boolean} true=二级认证已通过, false=尚未进行二级认证或认证已超时
	//  */
	// static isSafe(tokenValue, service) {
	// 	return this.stpLogic.isSafe(tokenValue, service);
	// }

	// /**
	//  * 校验：当前会话是否已通过二级认证，如未通过则抛出异常
	//  */
	// static checkSafe() {
	// 	this.stpLogic.checkSafe();
	// }

	/**
	 * 校验：检查当前会话是否已通过指定业务的二级认证，如未通过则抛出异常
	 *
	 * @param {String} service 业务标识
	 */
	static checkSafe(service) {
		this.stpLogic.checkSafe(service);
	}

	// /**
	//  * 获取：当前会话的二级认证剩余有效时间（单位: 秒, 返回-2代表尚未通过二级认证）
	//  *
	//  * @return {long} 剩余有效时间
	//  */
	// static getSafeTime() {
	// 	return this.stpLogic.getSafeTime();
	// }

	/**
	 * 获取：当前会话的二级认证剩余有效时间（单位: 秒, 返回-2代表尚未通过二级认证）
	 *
	 * @param {String} service 业务标识
	 * @return {long} 剩余有效时间
	 */
	static getSafeTime(service) {
		return this.stpLogic.getSafeTime(service);
	}

	// /**
	//  * 在当前会话 结束二级认证 
	//  */
	// static closeSafe() {
	// 	this.stpLogic.closeSafe();
	// }

	/**
	 * 在当前会话 结束指定业务标识的二级认证
	 *
	 * @param {String} service 业务标识
	 */
	static closeSafe(service) {
		this.stpLogic.closeSafe(service);
	}


	// ------------------- Bean 对象、字段代理 -------------------

	/**
	 * 根据当前配置对象创建一个 SaLoginParameter 对象
	 *
	 * @return {SaLoginParameter} /
	 */
	static createSaLoginParameter() {
		return this.stpLogic.createSaLoginParameter();
	}


	// ------------------- 过期方法 -------------------

	/**
	 * <h2>请更换为 getLoginDeviceType </h2>
	 * 返回当前会话的登录设备类型
	 *
	 * @return {String} 当前令牌的登录设备类型
	 */
	// @Deprecated
	static getLoginDevice() {
		return this.stpLogic.getLoginDevice();
	}

	/**
	 * <h2>请更换为 getLoginDeviceTypeByToken </h2>
	 * 返回指定 token 会话的登录设备类型
	 *
	 * @param {String} tokenValue 指定token
	 * @return {String} 当前令牌的登录设备类型
	 */
	// @Deprecated
	static getLoginDeviceByToken(tokenValue) {
		return this.stpLogic.getLoginDeviceByToken(tokenValue);
	}

}

export default StpUtil;
