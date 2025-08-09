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
 * Token 信息 Model: 用来描述一个 Token 的常见参数。
 *
 * <p>
 *     例如：<br>
 *     <pre>
 *     {
 *         "tokenName": "satoken",           // token名称
 *         "tokenValue": "e67b99f1-3d7a-4a8d-bb2f-e888a0805633",      // token值
 *         "isLogin": true,                  // 此token是否已经登录
 *         "loginId": "10001",               // 此token对应的LoginId，未登录时为null
 *         "loginType": "login",              // 账号类型标识
 *         "tokenTimeout": 2591977,          // token剩余有效期 (单位: 秒)
 *         "sessionTimeout": 2591977,        // Account-Session剩余有效时间 (单位: 秒)
 *         "tokenSessionTimeout": -2,        // Token-Session剩余有效时间 (单位: 秒) (-2表示系统中不存在这个缓存)
 *         "tokenActiveTimeout": -1,       // Token 距离被冻结还剩多少时间 (单位: 秒)
 *         "loginDevice": "DEF"   // 登录设备类型
 *     }
 *     </pre>
 * </p>
 * 
 * @author click33
 * @since 1.10.0
 */
class SaTokenInfo {

	/** token 名称 {String} */
	tokenName;

	/** token 值 {String} */
	tokenValue;

	/** 此 token 是否已经登录 {Boolean} */
	isLogin;

	/** 此 token 对应的 LoginId，未登录时为 null {Object} */
	loginId;

	/** 多账号体系下的账号类型 {String} */
	loginType;

	/** token 剩余有效期（单位: 秒） {long} */
	tokenTimeout;

	/** Account-Session 剩余有效时间（单位: 秒） {long} */
	sessionTimeout;

	/** Token-Session 剩余有效时间（单位: 秒） {long} */
	tokenSessionTimeout;

	/** token 距离被冻结还剩多少时间（单位: 秒） {long} */
	tokenActiveTimeout;

	/** 登录设备类型 {String} */
	loginDeviceType;

	/** 自定义数据（暂无意义，留作扩展） {String} */
	tag;
	


	/**
	 * @return {String} token 名称
	 */
	getTokenName() {
		return this.tokenName;
	}

	/**
	 * @param {String} tokenName token 名称
	 */
	setTokenName(tokenName) {
		this.tokenName = tokenName;
	}

	/**
	 * @return {String} token 值
	 */
	getTokenValue() {
		return this.tokenValue;
	}

	/**
	 * @param {String} tokenValue token 值
	 */
	setTokenValue(tokenValue) {
		this.tokenValue = tokenValue;
	}

	/**
	 * @return {Boolean} 此 token 是否已经登录
	 */
	getIsLogin() {
		return this.isLogin;
	}

	/**
	 * @param {Boolean} isLogin 此 token 是否已经登录
	 */
	setIsLogin(isLogin) {
		this.isLogin = isLogin;
	}

	/**
	 * @return {Object} 此 token 对应的LoginId，未登录时为null
	 */
	getLoginId() { 
		return this.loginId;
	}

	/**
	 * @param {Object} loginId 此 token 对应的LoginId，未登录时为null
	 */
	setLoginId(loginId) {
		this.loginId = loginId;
	}

	/**
	 * @return {String} 多账号体系下的账号类型
	 */
	getLoginType() {
		return this.loginType;
	}

	/**
	 * @param {String} loginType 多账号体系下的账号类型
	 */
	setLoginType(loginType) {
		this.loginType = loginType;
	}

	/**
	 * @return {long} token 剩余有效期（单位: 秒）
	 */
	getTokenTimeout() {
		return this.tokenTimeout;
	}

	/**
	 * @param {long} tokenTimeout token剩余有效期（单位: 秒）
	 */
	setTokenTimeout(tokenTimeout) {
		this.tokenTimeout = tokenTimeout;
	}

	/**
	 * @return {long} Account-Session 剩余有效时间（单位: 秒）
	 */
	getSessionTimeout() {
		return this.sessionTimeout;
	}

	/**
	 * @param {long} sessionTimeout Account-Session剩余有效时间（单位: 秒）
	 */
	setSessionTimeout(sessionTimeout) {
		this.sessionTimeout = sessionTimeout;
	}

	/**
	 * @return {long} Token-Session剩余有效时间（单位: 秒）
	 */
	getTokenSessionTimeout() {
		return this.tokenSessionTimeout;
	}

	/**
	 * @param {long} tokenSessionTimeout Token-Session剩余有效时间（单位: 秒）
	 */
	setTokenSessionTimeout(tokenSessionTimeout) {
		this.tokenSessionTimeout = tokenSessionTimeout;
	}

	/**
	 * @return {long} token 距离被冻结还剩多少时间（单位: 秒）
	 */
	getTokenActiveTimeout() {
		return this.tokenActiveTimeout;
	}

	/**
	 * @param {long} tokenActiveTimeout token 距离被冻结还剩多少时间（单位: 秒）
	 */
	setTokenActiveTimeout(tokenActiveTimeout) {
		this.tokenActiveTimeout = tokenActiveTimeout;
	}

	/**
	 * @return {String} 登录设备类型
	 */
	getLoginDeviceType() {
		return this.loginDeviceType;
	}

	/**
	 * @param {String} loginDeviceType 登录设备类型
	 */
	setLoginDeviceType(loginDeviceType) {
		this.loginDeviceType = loginDeviceType;
	}

	/**
	 * @return {String} 自定义数据（暂无意义，留作扩展）
	 */
	getTag() {
		return this.tag;
	}

	/**
	 * @param {String} tag 自定义数据（暂无意义，留作扩展）
	 */
	setTag(tag) {
		this.tag = tag;
	}

	/**
	 * toString
	 */
	// @Override
    toString() {
        return `SaTokenInfo [
            tokenName=${this.tokenName},
            tokenValue=${this.tokenValue},
            isLogin=${this.isLogin},
            loginId=${this.loginId},
            loginType=${this.loginType},
            tokenTimeout=${this.tokenTimeout},
            sessionTimeout=${this.sessionTimeout},
            tokenSessionTimeout=${this.tokenSessionTimeout},
            tokenActiveTimeout=${this.tokenActiveTimeout},
            loginDeviceType=${this.loginDeviceType},
            tag=${this.tag}
        ]`;
    }
	// public String toString() {
	// 	return "SaTokenInfo [tokenName=" + tokenName + ", tokenValue=" + tokenValue + ", isLogin=" + isLogin
	// 			+ ", loginId=" + loginId + ", loginType=" + loginType + ", tokenTimeout=" + tokenTimeout
	// 			+ ", sessionTimeout=" + sessionTimeout + ", tokenSessionTimeout=" + tokenSessionTimeout
	// 			+ ", tokenActiveTimeout=" + tokenActiveTimeout + ", loginDeviceType=" + loginDeviceType + ", tag=" + tag
	// 			+ "]";
	// }

}

export default SaTokenInfo;

