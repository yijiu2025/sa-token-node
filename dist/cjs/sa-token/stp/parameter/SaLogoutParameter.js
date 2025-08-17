'use strict';

var SaManager = require('../../SaManager.js');
require('../../error/SaErrorCode.js');
require('dayjs');
require('dayjs/plugin/utc.js');
require('dayjs/plugin/timezone.js');
require('lodash');
require('./enums/SaReplacedRange.js');
var SaLogoutMode = require('./enums/SaLogoutMode.js');
require('./enums/SaLogoutRange.js');
require('../../dao/SaTokenDao.js');

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
 * 在会话注销时的 配置参数对象，决定注销时的一些细节行为 <br>
 *
 * <pre>
 *     	// 例如：
 *     	StpUtil.logout(10001, new SaLogoutParameter());
 * </pre>
 *
 * @author click33
 * @since 1.41.0
 */
class SaLogoutParameter {

	// --------- 单独参数

	/**
	 * 需要注销的设备类型 (为 null 代表不限制，为具体值代表只注销此设备类型的会话)
	 * <br/> (此参数只在调用 StpUtil.logout(id, parame) 时有效)
     * String
	 */
	deviceType;

	/**
	 * 需要注销的设备ID (为 null 代表不限制，为具体值代表只注销此设备ID的会话)
	 * <br/> (此参数只在调用 StpUtil.logout(id, param) 时有效)
     * String
	 */
	deviceId;

	/**
	 * 注销类型 (LOGOUT=注销下线、KICKOUT=踢人下线，REPLACED=顶人下线)
     * {SaLogoutMode}
	 */
	mode = SaLogoutMode.LOGOUT;


	// --------- 覆盖性参数

	/**
	 * 注销范围 (TOKEN=只注销当前 token 的会话，ACCOUNT=注销当前 token 指向的 loginId 其所有客户端会话)
	 * <br/> (此参数只在调用 StpUtil.logout(param) 时有效)
     * {SaLogoutRange}
	 */
	range;

	/**
	 * 如果 token 已被冻结，是否保留其操作权 (是否允许此 token 调用注销API)
	 * <br/> (此参数只在调用 StpUtil.[logout/kickout/replaced]ByTokenValue("token", param) 时有效)
     * {Boolean}
	 */
	isKeepFreezeOps;

	/**
	 * 在注销 token 后，是否保留其对应的 Token-Session
     * {Boolean}
	 */
	isKeepTokenSession;


	// ------ 附加方法

    constructor(config) {
        if (config) {
            this.setDefaultValues(config);
        } else {
            this.setDefaultValues(SaManager.default.getConfig());
        }
    }


	/**
	 * 根据 SaTokenConfig 对象初始化默认值
	 *
	 * @param {SaTokenConfig} config 使用的配置对象
	 * @return {SaLogoutParameter} 对象自身
	 */
	setDefaultValues(config) {
		this.range = config.getLogoutRange();
		this.isKeepFreezeOps = config.getIsLogoutKeepFreezeOps();
		this.isKeepTokenSession = config.getIsLogoutKeepTokenSession();
		return this;
	}

	/**
	 * 静态方法获取一个 SaLoginParameter 对象
	 * @return {SaLoginParameter} SaLoginParameter 对象
	 */
	create() {
		return new SaLogoutParameter(SaManager.default.getConfig());
	}



	// ---------------- get set

	/**
	 * @return {Boolean} 在注销 token 后，是否保留其对应的 Token-Session
	 */
	getIsKeepTokenSession() {
		return this.isKeepTokenSession;
	}

	/**
	 * @param {Boolean} isKeepTokenSession 在注销 token 后，是否保留其对应的 Token-Session
	 *
	 * @return {SaLogoutParameter} 对象自身
	 */
	setIsKeepTokenSession(isKeepTokenSession) {
		this.isKeepTokenSession = isKeepTokenSession;
		return this;
	}

	/**
	 * 获取 如果 token 已被冻结，是否保留其操作权 (是否允许此 token 调用注销API)
	 * <br/> (此参数只在调用 StpUtil.[logout/kickout/replaced]ByTokenValue("token", param) 时有效)
	 *
	 * @return {Boolean} /
	 */
	getIsKeepFreezeOps() {
		return this.isKeepFreezeOps;
	}

	/**
	 * 设置 如果 token 已被冻结，是否保留其操作权 (是否允许此 token 调用注销API)
	 * <br/> (此参数只在调用 StpUtil.[logout/kickout/replaced]ByTokenValue("token", param) 时有效)
	 *
	 * @param {Boolean} isKeepFreezeOps /
	 * @return {SaLogoutParameter} 对象自身
	 */
	setIsKeepFreezeOps(isKeepFreezeOps) {
		this.isKeepFreezeOps = isKeepFreezeOps;
		return this;
	}

	/**
	 * 需要注销的设备类型 (为 null 代表不限制，为具体值代表只注销此设备类型的会话)
	 * <br/> (此参数只在调用 StpUtil.logout(id, parame) 时有效)
	 *
	 * @return {String} deviceType /
	 */
	getDeviceType() {
		return this.deviceType;
	}

	/**
	 * 需要注销的设备类型 (为 null 代表不限制，为具体值代表只注销此设备类型的会话)
	 * <br/> (此参数只在调用 StpUtil.logout(id, parame) 时有效)
	 *
	 * @param {String} deviceType /
	 * @return {SaLogoutParameter} 对象自身/
	 */
	setDeviceType(deviceType) {
		this.deviceType = deviceType;
		return this;
	}

	/**
	 * 需要注销的设备ID (为 null 代表不限制，为具体值代表只注销此设备 ID 的会话)
	 * <br/> (此参数只在调用 StpUtil.logout(id, parame) 时有效)
	 *
	 * @return {String} /
	 */
	getDeviceId() {
		return this.deviceId;
	}

	/**
	 * 需要注销的设备类型 (为 null 代表不限制，为具体值代表只注销此设备 ID 的会话)
	 * <br/> (此参数只在调用 StpUtil.logout(id, parame) 时有效)
	 *
	 * @param {String} deviceId /
	 * @return {SaLogoutParameter} /
	 */
	setDeviceId(deviceId) {
		this.deviceId = deviceId;
		return this;
	}

	/**
	 * 注销类型 (LOGOUT=注销下线、KICKOUT=踢人下线，REPLACED=顶人下线)
	 *
	 * @return {SaLogoutMode} logoutMode 注销类型
	 */
	getMode() {
		return this.mode;
	}

	/**
	 * 注销类型 (LOGOUT=注销下线、KICKOUT=踢人下线，REPLACED=顶人下线)
	 *
	 * @param {SaLogoutMode} mode 注销类型
	 * @return {SaLogoutParameter} /
	 */
	setMode(mode) {
		this.mode = mode;
		return this;
	}

	/**
	 * 注销范围 (TOKEN=只注销当前 token 的会话，ACCOUNT=注销当前 token 指向的 loginId 其所有客户端会话)
	 * <br/> (此参数只在调用 StpUtil.logout(param) 时有效)
	 *
	 * @return {SaLogoutRange} /
	 */
	getRange() {
		return this.range;
	}

	/**
	 * 注销范围 (TOKEN=只注销当前 token 的会话，ACCOUNT=注销当前 token 指向的 loginId 其所有客户端会话)
	 * <br/> (此参数只在调用 StpUtil.logout(param) 时有效)
	 *
	 * @param {SaLogoutRange} range /
	 * @return {SaLogoutParameter} /
	 */
	setRange(range) {
		this.range = range;
		return this;
	}

	/*
	 * toString
     * @return {String} 字符串表示形式
	 */
	// @Override
    toString() {
        return `SaLogoutParameter [
            deviceType=${this.deviceType},
            deviceId=${this.deviceId},
            isKeepTokenSession=${this.isKeepTokenSession},
            isKeepFreezeOps=${this.isKeepFreezeOps},
            mode=${this.mode},
            range=${this.range}
        ]`;
    }
	// toString() {
	// 	return "SaLoginParameter ["
	// 			+ "deviceType=" + deviceType
	// 			+ ", deviceId=" + deviceId
	// 			+ ", isKeepTokenSession=" + isKeepTokenSession
	// 			+ ", isKeepFreezeOps=" + isKeepFreezeOps
	// 			+ ", mode=" + mode
	// 			+ ", range=" + range
	// 			+ "]";
	// }

}
//module.exports = SaLogoutParameter; // CommonJS 环境下使用

module.exports = SaLogoutParameter;
