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

/**
 * TOTP 工具类，支持 生成/验证 动态一次性密码
 *
 * @author click33
 * @since 1.42.0
 */
class SaTotpUtil {

	/**
	 * 生成随机密钥（Base32编码）
	 *
	 * @return {String} /
	 */
	static generateSecretKey() {
		return SaManager.getSaTotpTemplate().generateSecretKey();
	}

	/**
	 * 生成当前时间的TOTP验证码
	 *
	 * @param {String} secretKey Base32编码的密钥
	 * @return {String} /
	 */
	static generateTOTP(secretKey) {
		return SaManager.getSaTotpTemplate()._generateTOTP(secretKey);
	}

	/**
	 * 判断用户输入的TOTP是否有效
	 *
	 * @param {String} secretKey Base32编码的密钥
	 * @param {String} code 用户输入的验证码
	 * @param {int} timeWindowOffset 允许的时间窗口偏移量（如1表示允许前后各1个时间窗口）
	 * @return {Boolean} /
	 */
	static validateTOTP(secretKey, code, timeWindowOffset) {
		return SaManager.getSaTotpTemplate().validateTOTP(secretKey, code, timeWindowOffset);
	}

	/**
	 * 校验用户输入的TOTP是否有效，如果无效则抛出异常
	 *
	 * @param {String} secretKey Base32编码的密钥
	 * @param {String} code 用户输入的验证码
	 * @param {int} timeWindowOffset 允许的时间窗口偏移量（如1表示允许前后各1个时间窗口）
	 */
	static checkTOTP(secretKey, code, timeWindowOffset) {
		SaManager.getSaTotpTemplate().checkTOTP(secretKey, code, timeWindowOffset);
	}

	/**
	 * 生成谷歌认证器的扫码字符串 (形如：otpauth://totp/{account}?secret={secretKey})
	 *
	 * @param {String} account  账户名
	 * @return {String} /
	 */
    static generateGoogleSecretKey(account, arg2, arg3) {
        const totpTemplate = SaManager.getSaTotpTemplate();
        let issuer, secretKey;
        
        // 参数解析逻辑
        if (arg3 !== undefined) {
            // 三个参数的情况：account, issuer, secretKey
            issuer = arg2;
            secretKey = arg3;
            return totpTemplate.generateGoogleSecretKey(account, issuer, secretKey);
        } else if (arg2 !== undefined) {
            secretKey = arg2;
            return totpTemplate.generateGoogleSecretKey(account, secretKey);
        } else {
            return totpTemplate.generateGoogleSecretKey(account);
        }

    }


	// static generateGoogleSecretKey(account) {
	// 	return SaManager.getSaTotpTemplate().generateGoogleSecretKey(account);
	// }

	// /**
	//  * 生成谷歌认证器的扫码字符串 (形如：otpauth://totp/{account}?secret={secretKey})
	//  *
	//  * @param {String} account  账户名
	//  * @param {String} secretKey  TOTP 秘钥
	//  * @return /
	//  */
	// static generateGoogleSecretKey(account, secretKey) {
	// 	return SaManager.getSaTotpTemplate().generateGoogleSecretKey(account, secretKey);
	// }

	// /**
	//  * 生成谷歌认证器的扫码字符串 (形如：otpauth://totp/{issuer}:{account}?secret={secretKey}&issuer={issuer})
	//  *
	//  * @param {String} account  账户名
	//  * @param {String} issuer  签发者
	//  * @param {String} secretKey  TOTP 秘钥
	//  * @return {String} /
	//  */
	// static generateGoogleSecretKey(account, issuer,secretKey) {
	// 	return SaManager.getSaTotpTemplate().generateGoogleSecretKey(account, issuer, secretKey);
	// }

}
export default SaTotpUtil;
