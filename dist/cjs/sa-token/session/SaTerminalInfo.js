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
 * 登录设备终端信息 Model
 *
 * @author click33
 * @since 1.41.0
 */
class SaTerminalInfo {
	/**
     * 构建一个终端信息对象
     * @param {number} [index] 索引
     * @param {string} [tokenValue] token值
     * @param {string} [deviceType] 设备类型
     * @param {Object} [extraData] 扩展数据
     */
    constructor(index, tokenValue, deviceType, extraData) {
        /**
		 * 登录会话索引值 (该账号第几个登录的设备, 从 1 开始) {int}
		 */
        this.index = index || 0;
        
        /**
		 * Token 值 {String}
		 */
        this.tokenValue = tokenValue || '';
        
        /**
		 * 所属设备类型，例如：PC、WEB、HD、MOBILE、APP {String}
		 */
        this.deviceType = deviceType || '';
        
        /**
		 * 登录设备唯一标识，例如：kQwIOrYvnXmSDkwEiFngrKidMcdrgKorXmSDkwEiFngrKidM {String}
		 */
        this.deviceId = '';
        
        /**
		 * 此次登录的自定义扩展数据 (只允许在登录前设定，登录后不建议更改) {Map<String, Object>}
		 */
        this.extraData = extraData ? new Map(Object.entries(extraData)) : new Map();
        
        /**
		 * 创建时间 {long}
		 */
        this.createTime = Date.now();
    }



	/**
	 * 构建一个
	 *
	 * @param index 		登录会话索引值 (该账号第几个登录的设备)
	 * @param tokenValue  	Token 值
	 * @param deviceType 	所属设备类型
	 * @param extraData 			此客户端登录的挂载数据
	 */

	// 扩展方法

	/**
	 * 此次登录的自定义扩展数据 (只允许在登录前设定，登录后不建议更改)
	 * @param {String} key 键
	 * @param {Object} value 值
	 * @return {SaTerminalInfo} 对象自身
	 */
	setExtra(key, value) {
        if (this.extraData == null) {
            this.extraData = new Map();
        }
        this.extraData.set(key, value);
        return this;
    }


	/**
	 * 此次登录的自定义扩展数据
	 * @param {String} key 键
	 * @return {Object} 扩展数据的值
	 */
	getExtra(key) {
		if(this.extraData == null) {
			return null;
		}
		return this.extraData?.get(key);
	}

	/**
	 * 判断是否设置了扩展数据
	 * @return {boolean} /
	 */
	haveExtraData() {
        return this.extraData != null && this.extraData.size > 0;
    }



	// -------------------- get/set --------------------

	/**
	 * 获取 登录会话索引值 (该账号第几个登录的设备)
	 *
	 * @return {int} index 登录会话索引值 (该账号第几个登录的设备)
	 */
	getIndex() {
        return this.index;
    }

	/**
	 * 设置 登录会话索引值 (该账号第几个登录的设备)
	 *
	 * @param {int} index 登录会话索引值 (该账号第几个登录的设备)
	 * @return {SaTerminalInfo} 对象自身
	 */
	setIndex(index) {
        this.index = index;
        return this;
    }

	/**
	 * @return {String} Token 值
	 */
	getTokenValue() {
        return this.tokenValue;
    }

	/**
	 * 写入 Token 值
	 *
	 * @param {String} tokenValue /
	 * @return {SaTerminalInfo} 对象自身
	 */
	setTokenValue(tokenValue) {
        this.tokenValue = tokenValue;
        return this;
    }

	/**
	 * @return {String} 所属设备类型
	 */
	getDeviceType() {
        return this.deviceType;
    }

	/**
	 * 写入所属设备类型
	 * 
	 * @param {String} deviceType /
	 * @return {SaTerminalInfo} 对象自身
	 */
	setDeviceType(deviceType) {
        this.deviceType = deviceType;
        return this;
    }

	/**
	 * 获取 登录设备唯一标识
	 *
	 * @return {String} deviceId 登录设备唯一标识
	 */
	getDeviceId() {
        return this.deviceId;
    }

	/**
	 * 设置 登录设备唯一标识，例如：kQwIOrYvnXmSDkwEiFngrKidMcdrgKorXmSDkwEiFngrKidM
	 *
	 * @param {String} deviceId 登录设备唯一标识，例如：kQwIOrYvnXmSDkwEiFngrKidMcdrgKorXmSDkwEiFngrKidM
	 * @return {SaTerminalInfo} 对象自身
	 */
	setDeviceId(deviceId) {
        this.deviceId = deviceId;
        return this;
    }

	/**
	 * 获取 此客户端登录的挂载数据
	 *
	 * @return {Map<String, Object>} extraData/
	 */
	getExtraData() {
        return this.extraData;
    }

	/**
	 * 设置 此客户端登录的挂载数据
	 *
	 * @param {Map<String, Object>} extraData /
	 * @return {SaTerminalInfo} 对象自身
	 */
	setExtraData(extraData) {
        this.extraData = extraData;
        return this;
    }


	/**
	 * 获取 创建时间
	 *
	 * @return {long} createTime 创建时间
	 */
	getCreateTime() {
        return this.createTime;
    }

	/**
	 * 设置 创建时间
	 *
	 * @param {long} createTime 创建时间
	 * @return {SaTerminalInfo} 对象自身
	 */
	setCreateTime(createTime) {
        this.createTime = createTime;
        return this;
    }

	//
	// @Override
	toString() {
        return `SaTerminalInfo [index=${this.index}, tokenValue=${this.tokenValue}, ` +
               `deviceType=${this.deviceType}, deviceId=${this.deviceId}, ` +
               `extraData=${this.extraData ? Object.fromEntries(this.extraData) : null}, ` +
               `createTime=${this.createTime}]`;
    }
	// public String toString() {
	// 	return "SaTerminalInfo [" +
	// 			"index=" + index +
	// 			", tokenValue='" + tokenValue +
	// 			", deviceType='" + deviceType +
	// 			", deviceId='" + deviceId +
	// 			", extraData=" + extraData +
	// 			", createTime=" + createTime +
	// 			']';
	// }

	/*
	 * Expand in the future:
	 * 		deviceName  登录设备端名称，一般为浏览器名称
	 * 		systemName  登录设备操作系统名称
	 * 		loginIp  登录IP地址
	 * 		address  登录设备地理位置
	 * 		loginTime  登录时间
	 */

}

module.exports = SaTerminalInfo;
