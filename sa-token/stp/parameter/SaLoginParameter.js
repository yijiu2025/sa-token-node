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

import SaManager from "../../SaManager.js";
import SaCookieConfig from "../../config/SaCookieConfig.js";
import SaTokenConfig from "../../config/SaTokenConfig.js";
import SaTokenDao from "../../dao/SaTokenDao.js";
import SaParamFunction from "../../fun/SaParamFunction.js";
import SaLogoutMode from "./enums/SaLogoutMode.js";
import SaReplacedRange from "./enums/SaReplacedRange.js";
import SaTokenConsts from "../../util/SaTokenConsts.js";

/**
 * 在调用 `StpUtil.login()` 时的 配置参数对象，决定登录的一些细节行为 <br>
 *
 * <pre>
 *     	// 例如：在登录时指定 token 有效期为七天，代码如下：
 *     	StpUtil.login(10001, new SaLoginParameter().setTimeout(60 * 60 * 24 * 7));
 * </pre>
 *
 * @author click33
 * @since 1.13.2
 */
class SaLoginParameter {

	// --------- 单独参数

	/**
	 * 此次登录的客户端设备类型  
     * {String}
	 */
	deviceType;

	/**
	 * 此次登录的客户端设备id  
     * {String}
	 */
	deviceId;  

	/**
	 * 扩展信息（只在 jwt 模式下生效）  
     * {Map<String, Object}
	 */
	extraData;

	/**
	 * 预定Token（预定本次登录生成的Token值）  
     * {String}
	 */
	token;

	/**
	 * 本次登录挂载到 SaTerminalInfo 的自定义扩展数据  
     * {Map<String, Object>}
	 */
	terminalExtraData; 


	// --------- 覆盖性参数

	/**
	 * 指定此次登录 token 有效期，单位：秒 （如未指定，自动取全局配置的 timeout 值） 
     * {long}
	 */
	timeout;

	/**
	 * 指定此次登录 token 最低活跃频率，单位：秒（如未指定，则使用全局配置的 activeTimeout 值） 
     * {Long}
	 */
	activeTimeout;

	/**
	 * 是否允许同一账号多地同时登录 （为 true 时允许一起登录, 为 false 时新登录挤掉旧登录） 
     * {Boolean}
	 */
	isConcurrent;

	/**
	 * 在多人登录同一账号时，是否共用一个 token （为 true 时所有登录共用一个 token, 为 false 时每次登录新建一个 token） 
     * {Boolean}
	 */
	isShare;

	/**
	 * 同一账号最大登录数量，-1代表不限 （只有在 isConcurrent=true, isShare=false 时此配置项才有意义） 
     * {int}
	 */
	maxLoginCount;

	/**
	 * 在每次创建 token 时的最高循环次数，用于保证 token 唯一性（-1=不循环尝试，直接使用） 
     * {int}
	 */
	maxTryTimes;

	/**
	 * 是否为持久Cookie（临时Cookie在浏览器关闭时会自动删除，持久Cookie在重新打开后依然存在） 
     * {Boolean}
	 */
	isLastingCookie;

	/**
	 * 是否在登录后将 Token 写入到响应头 
     * {Boolean}
	 */
	isWriteHeader;

	/**
	 * 当 isConcurrent=false 时，顶人下线的范围 (CURR_DEVICE_TYPE=当前指定的设备类型端, ALL_DEVICE_TYPE=所有设备类型端) 
     * {SaReplacedRange}
	 */
	replacedRange;

	/**
	 * 溢出 maxLoginCount 的客户端，将以何种方式注销下线 (LOGOUT=注销下线, KICKOUT=踢人下线, REPLACED=顶人下线) 
     * {SaLogoutMode}
	 */
	overflowLogoutMode;

	/**
	 * 在登录时，是否立即创建对应的 Token-Session （true=在登录时立即创建，false=在第一次调用 getTokenSession() 时创建） 
     * {Boolean}
	 */
	rightNowCreateTokenSession;

	/**
	 * Cookie 配置对象  
     * {SaCookieConfig}
	 */
	cookie = new SaCookieConfig();


	// ------ 附加方法

	constructor(config) {
        if (config) {
            this.setDefaultValues(config);
        } else {
            this.setDefaultValues(SaManager.getConfig());
        }
    }

	// public SaLoginParameter() {
	// 	this(SaManager.getConfig());
	// }
	// public SaLoginParameter(SaTokenConfig config) {
	// 	setDefaultValues(config);
	// }

	/**
	 * 根据 SaTokenConfig 对象初始化默认值
	 *
	 * @param {SaTokenConfig} config 使用的配置对象
	 * @return {SaLoginParameter} this 对象自身
	 */
	setDefaultValues(config) {
		this.deviceType = SaTokenConsts.DEFAULT_LOGIN_DEVICE_TYPE;
		this.timeout = config.getTimeout();
		this.isConcurrent = config.getIsConcurrent();
		this.isShare = config.getIsShare();
		this.maxLoginCount = config.getMaxLoginCount();
		this.maxTryTimes = config.getMaxTryTimes();
		this.isLastingCookie = config.getIsLastingCookie();
		this.isWriteHeader = config.getIsWriteHeader();
		this.replacedRange = config.getReplacedRange();
		this.overflowLogoutMode = config.getOverflowLogoutMode();
		this.rightNowCreateTokenSession = config.getRightNowCreateTokenSession();

		this.setupCookieConfig(cookie => {
			const gCookie = config.getCookie();
			cookie.setDomain(gCookie.getDomain());
			cookie.setPath(gCookie.getPath());
			cookie.setSecure(gCookie.getSecure());
			cookie.setHttpOnly(gCookie.getHttpOnly());
			cookie.setSameSite(gCookie.getSameSite());
			cookie.setExtraAttrs(new Map(gCookie.getExtraAttrs()));
		});

		return this;
	}

	/**
	 * 写入扩展数据（只在jwt模式下生效）
	 * @param {String} key 键
	 * @param {Object} value 值
	 * @return {SaLoginParameter} 对象自身
	 */
	setExtra(key, value) {
		if(this.extraData == null) {
			this.extraData = new Map();
		}
		this.extraData.set(key, value);
		return this;
	}

	/**
	 * 获取扩展数据（只在jwt模式下生效）
	 * @param {String} key 键
	 * @return {Object} 扩展数据的值
	 */
	getExtra(key) {
		if(this.extraData == null) {
			return null;
		}
		return this.extraData.get(key);
	}

	/**
	 * 判断是否设置了扩展数据（只在jwt模式下生效）
	 * @return {boolean} /
	 */
	haveExtraData() {
		return this.extraData != null && this.extraData.size > 0;
	}

	/**
	 * 写入本次登录挂载到 SaTerminalInfo 的自定义扩展数据
	 * @param {String} key 键
	 * @param {Object} value 值 
	 * @return {SaLoginParameter} 对象自身 
	 */
	setTerminalExtra(key, value) {
		if(this.terminalExtraData == null) {
			this.terminalExtraData = new Map();
		}
		this.terminalExtraData.set(key, value);
		return this;
	}

	/**
	 * 获取本次登录挂载到 SaTerminalInfo 的自定义扩展数据
	 * @param {String} key 键
	 * @return {Object} 扩展数据的值 
	 */
	getTerminalExtra(key) {
		if(this.terminalExtraData == null) {
			return null;
		}
		return this.terminalExtraData?.get(key);
	}

	/**
	 * 判断是否设置了本次登录挂载到 SaTerminalInfo 的自定义扩展数据
	 * @return {boolean} / 
	 */
    haveTerminalExtraData() {
        return this.terminalExtraData && this.terminalExtraData.size > 0;
    }

	/**
	 * 计算 Cookie 时长
	 * @return {int}  /
	 */
	getCookieTimeout() {
		if( ! this.getIsLastingCookie()) {
			return -1;
		}
		const _timeout = this.getTimeout();
		if(_timeout === SaTokenDao.NEVER_EXPIRE || _timeout > Number.MAX_SAFE_INTEGER) {
			return Number.MAX_SAFE_INTEGER;
		}
		return Math.floor(_timeout);
	}

	/**
	 * 静态方法获取一个 SaLoginParameter 对象
	 * @return {SaLoginParameter} SaLoginParameter 对象
	 */
	static create() {
		return new SaLoginParameter(SaManager.getConfig());
	}

	/**
	 * 设置 Cookie 配置项
	 * @param {SaParamFunction<SaCookieConfig>} fun /
	 * @return {SaLoginParameter} 对象自身
	 */
	setupCookieConfig(func) {
		func(this.cookie);
        return this;
	}



	// ---------------- get set

	/**
	 * @return {String} 此次登录的客户端设备类型
	 */
	getDeviceType() { 
        return this.deviceType; 
    }

	/**
	 * @param {String} deviceType 此次登录的客户端设备类型
	 * @return {SaLoginParameter} 对象自身
	 */
	setDeviceType(deviceType) {
		this.deviceType = deviceType;
		return this;
	}

	/**
	 * 获取 此次登录的客户端设备id
	 *
	 * @return {String} deviceId 此次登录的客户端设备id
	 */
	getDeviceId() {
		return this.deviceId;
	}

	/**
	 * 设置 此次登录的客户端设备id
	 *
	 * @param {String} deviceId 此次登录的客户端设备id
	 * @return {SaLoginParameter} 对象自身
	 */
	setDeviceId(deviceId) {
		this.deviceId = deviceId;
		return this;
	}

	/**
	 * 当 isConcurrent=false 时，顶人下线的范围 (CURR_DEVICE_TYPE=当前指定的设备类型端, ALL_DEVICE_TYPE=所有设备类型端)
	 *
	 * @return {SaReplacedRange} /replacedMode 顶人下线的范围
	 */
	getReplacedRange() {
		return this.replacedRange;
	}

	/**
	 * 当 isConcurrent=false 时，顶人下线的范围 (CURR_DEVICE_TYPE=当前指定的设备类型端, ALL_DEVICE_TYPE=所有设备类型端)
	 *
	 * @param {SaReplacedRange} replacedRange /
	 * @return {SaLoginParameter} 对象自身
	 */
	setReplacedRange(replacedRange) { 
		this.replacedRange = replacedRange;
		return this;
	}

	/**
	 * 获取 溢出 maxLoginCount 的客户端，将以何种方式注销下线 (LOGOUT=注销下线, KICKOUT=踢人下线, REPLACED=顶人下线)
	 *
	 * @return {SaLogoutMode} overflowLogoutMode /
	 */
	getOverflowLogoutMode() {
		return this.overflowLogoutMode;
	}

	/**
	 * 设置 溢出 maxLoginCount 的客户端，将以何种方式注销下线 (LOGOUT=注销下线, KICKOUT=踢人下线, REPLACED=顶人下线)
	 *
	 * @param {SaLogoutMode} overflowLogoutMode /
	 * @return {SaLoginParameter} 对象自身
	 */
	setOverflowLogoutMode(overflowLogoutMode) {
		this.overflowLogoutMode = overflowLogoutMode;
		return this;
	}

	/**
	 * @return {boolean} /是否为持久Cookie（临时Cookie在浏览器关闭时会自动删除，持久Cookie在重新打开后依然存在）
	 */
	getIsLastingCookie() {
		return this.isLastingCookie;
	}

	/**
	 * @param {boolean} isLastingCookie 是否为持久Cookie（临时Cookie在浏览器关闭时会自动删除，持久Cookie在重新打开后依然存在）
	 * @return {SaLoginParameter} 对象自身
	 */
	setIsLastingCookie(isLastingCookie) {
		this.isLastingCookie = isLastingCookie;
		return this;
	}

	/**
	 * @return {long} 指定此次登录 token 有效期，单位：秒
	 */
	getTimeout() {
		return this.timeout;
	}

	/**
	 * @param {long} timeout 指定此次登录 token 有效期，单位：秒 （如未指定，自动取全局配置的 timeout 值）
	 * @return {SaLoginParameter} 对象自身
	 */
	setTimeout(timeout) {
		this.timeout = timeout;
		return this;
	}

	/**
	 * @return {long} 此次登录 token 最低活跃频率，单位：秒（如未指定，则使用全局配置的 activeTimeout 值）
	 */
	getActiveTimeout() {
		return this.activeTimeout;
	}

	/**
	 * @param {long} activeTimeout 指定此次登录 token 最低活跃频率，单位：秒（如未指定，则使用全局配置的 activeTimeout 值）
	 * @return {SaLoginParameter} 对象自身
	 */
	setActiveTimeout(activeTimeout) {
		this.activeTimeout = activeTimeout;
		return this;
	}

	/**
	 * @return {boolean} 是否允许同一账号多地同时登录 （为 true 时允许一起登录, 为 false 时新登录挤掉旧登录）
	 */
	getIsConcurrent() {
		return this.isConcurrent;
	}

	/**
	 * @param {boolean} isConcurrent 是否允许同一账号多地同时登录 （为 true 时允许一起登录, 为 false 时新登录挤掉旧登录）
	 * @return {SaLoginParameter} 对象自身
	 */
	setIsConcurrent(isConcurrent) {
		this.isConcurrent = isConcurrent;
		return this;
	}

	/**
	 * @return {boolean} 在多人登录同一账号时，是否共用一个 token （为 true 时所有登录共用一个token, 为 false 时每次登录新建一个 token）
	 */
	getIsShare() {
		return this.isShare;
	}

	/**
	 * @param {boolean} isShare 在多人登录同一账号时，是否共用一个 token （为 true 时所有登录共用一个token, 为 false 时每次登录新建一个 token）
	 * @return {SaLoginParameter} 对象自身
	 */
	setIsShare(isShare) {
		this.isShare = isShare;
		return this;
	}

	/**
	 * @return {int} 同一账号最大登录数量，-1代表不限 （只有在 isConcurrent=true, isShare=false 时此配置项才有意义）
	 */
	getMaxLoginCount() {
		return this.maxLoginCount;
	}

	/**
	 * @param {int} maxLoginCount 同一账号最大登录数量，-1代表不限 （只有在 isConcurrent=true, isShare=false 时此配置项才有意义）
	 * @return {SaLoginParameter} 对象自身
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
	 * @param {int} maxTryTimes 在每次创建 token 时的最高循环次数，用于保证 token 唯一性（-1=不循环尝试，直接使用）
	 * @return {SaLoginParameter} 对象自身
	 */
	setMaxTryTimes(maxTryTimes) {
		this.maxTryTimes = maxTryTimes;
		return this;
	}

	/**
	 * @return {Map<String, Object>} 扩展信息（只在jwt模式下生效）
	 */
	getExtraData() {
		return this.extraData;
	}

	/**
	 * @param {Map<String, Object>}xtraData 扩展信息（只在jwt模式下生效）
	 * @return {SaLoginParameter} 对象自身
	 */
	setExtraData(extraData) {
		this.extraData = extraData;
		return this;
	}

	/**
	 * @return {String} 预定Token（预定本次登录生成的Token值）
	 */
	getToken() {
		return this.token;
	}

	/**
	 * @param {String} token 预定Token（预定本次登录生成的Token值）
	 * @return {SaLoginParameter} 对象自身
	 */
	setToken(token) {
		this.token = token;
		return this;
	}

	/**
	 * @return {boolean} 是否在登录后将 Token 写入到响应头
	 */
	getIsWriteHeader() {
		return this.isWriteHeader;
	}

	/**
	 * @param {boolean} isWriteHeader 是否在登录后将 Token 写入到响应头
	 * @return {SaLoginParameter} 对象自身
	 */
	setIsWriteHeader(isWriteHeader) {
		this.isWriteHeader = isWriteHeader;
		return this;
	}

	/**
	 * 获取 本次登录挂载到 SaTerminalInfo 的自定义扩展数据
	 *
	 * @return {Map<String, Object>}/
	 */
	getTerminalExtraData() {
		return this.terminalExtraData;
	}

	/**
	 * 设置 本次登录挂载到 SaTerminalInfo 的自定义扩展数据
	 *
	 * @param {Map<String, Object>} terminalExtraData /
	 * @return {SaLoginParameter} 对象自身
	 */
	setTerminalExtraData(terminalExtraData) {
		this.terminalExtraData = terminalExtraData;
		return this;
	}

	/**
	 * 获取 在登录时，是否立即创建对应的 Token-Session （true=在登录时立即创建，false=在第一次调用 getTokenSession() 时创建）
	 *
	 * @return {boolean} /
	 */
	getRightNowCreateTokenSession() {
		return this.rightNowCreateTokenSession;
	}

	/**
	 * 设置 在登录时，是否立即创建对应的 Token-Session （true=在登录时立即创建，false=在第一次调用 getTokenSession() 时创建）
	 *
	 * @param {boolean} rightNowCreateTokenSession /
	 * @return {SaLoginParameter} 对象自身
	 */
	setRightNowCreateTokenSession(rightNowCreateTokenSession) {
		this.rightNowCreateTokenSession = rightNowCreateTokenSession;
		return this;
	}

	/**
	 * @return {SaCookieConfig} Cookie 配置对象
	 */
	getCookie() {
		return this.cookie;
	}

	/**
	 * @param {SaCookieConfig} cookie Cookie 配置对象
	 * @return {SaLoginParameter} 对象自身
	 */
	setCookie(cookie) {
		this.cookie = cookie;
		return this;
	}

	/*
	 * toString 
     * @returns {String} 对象的字符串表示
	 */
	// @Override
    toString() {
        return `SaLoginParameter [
            deviceType=${this.deviceType},
            deviceId=${this.deviceId},
            replacedRange=${this.replacedRange},
            overflowLogoutMode=${this.overflowLogoutMode},
            isLastingCookie=${this.isLastingCookie},
            timeout=${this.timeout},
            activeTimeout=${this.activeTimeout},
            isConcurrent=${this.isConcurrent},
            isShare=${this.isShare},
            maxLoginCount=${this.maxLoginCount},
            maxTryTimes=${this.maxTryTimes},
            extraData=${this.extraData ? Object.fromEntries(this.extraData) : null},
            token=${this.token},
            isWriteHeader=${this.isWriteHeader},
            terminalExtraData=${this.terminalExtraData ? Object.fromEntries(this.terminalExtraData) : null},
            rightNowCreateTokenSession=${this.rightNowCreateTokenSession},
            cookie=${this.cookie}
        ]`;
    }
	// public String toString() {
	// 	return "SaLoginParameter ["
	// 			+ "deviceType=" + deviceType
	// 			+ ", deviceId=" + deviceId
	// 			+ ", replacedRange=" + replacedRange
	// 			+ ", overflowLogoutMode=" + overflowLogoutMode
	// 			+ ", isLastingCookie=" + isLastingCookie
	// 			+ ", timeout=" + timeout
	// 			+ ", activeTimeout=" + activeTimeout
	// 			+ ", isConcurrent=" + isConcurrent
	// 			+ ", isShare=" + isShare
	// 			+ ", maxLoginCount=" + maxLoginCount
	// 			+ ", maxTryTimes=" + maxTryTimes
	// 			+ ", extraData=" + extraData
	// 			+ ", token=" + token
	// 			+ ", isWriteHeader=" + isWriteHeader
	// 			+ ", terminalTag=" + terminalExtraData
	// 			+ ", rightNowCreateTokenSession=" + rightNowCreateTokenSession
	// 			+ ", cookie=" + cookie
	// 			+ "]";
	// }




	/**
	 * <h2> 请更换为 getDeviceType </h2>
	 * @return {String} 此次登录的客户端设备类型
	 */
	// @Deprecated
	getDevice() {
		return this.deviceType;
	}

	/**
	 * <h2> 请更换为 setDeviceType </h2>
	 * @param {String} device 此次登录的客户端设备类型
	 * @return {SaLoginParameter} 对象自身
	 */
	// @Deprecated
	setDevice(device) {
		this.deviceType = device;
		return this;
	}

}

export default SaLoginParameter;
