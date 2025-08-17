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

import TotpAuthException from '../../exception/TotpAuthException.js';

import SaBase32Util from '../SaBase32Util.js'
import StrFormatter from '../../util/StrFormatter.js';
import crypto from 'crypto';
import pkg from 'hi-base32';
const { encode: base32Encode, decode: base32Decode } = pkg;

/**
 * TOTP 算法类，支持 生成/验证 动态一次性密码
 *
 * @author click33
 * @since 1.42.0
 */
class SaTotpTemplate {

    /**
     * 构造函数 (使用默认参数)
     * @param {Object} options 配置选项
     */
    /**
	 * 构造函数 (使用自定义参数)
	 *
	 * @param {int} timeStep 时间窗口步长（秒）
	 * @param {int} codeDigits 生成的验证码位数
	 * @param {String} hmacAlgorithm 哈希算法（HmacSHA1、HmacSHA256等）
	 * @param {int} secretKeyLength 密钥长度（字节，推荐16或32）
	 */
    constructor({
        timeStep = 30,
        codeDigits = 6,
        hmacAlgorithm = 'sha1',
        secretKeyLength = 16
    } = {}) {
        // 时间窗口步长（秒）
        this.timeStep = timeStep;
        // 生成的验证码位数
        this.codeDigits = codeDigits;
        // 哈希算法（sha1、sha256等）
        this.hmacAlgorithm = hmacAlgorithm;
        // 密钥长度（字节，推荐16或32）
        this.secretKeyLength = secretKeyLength;
    }

	//public String hmacAlgorithm = "HmacSHA1";


	/**
	 * 生成随机密钥（Base32编码）
	 *
	 * @return {string} /
	 */
	generateSecretKey() {
		const bytes = crypto.randomBytes(this.secretKeyLength);
        return base32Encode(bytes).replace(/=/g, '');
	}

	/**
	 * 生成当前时间的 TOTP 验证码
	 *
	 * @param {string} secretKey Base32编码的密钥 编码的密钥
	 * @return {string} 验证码	/
	 */

	// public String _generateTOTP(String secretKey) {
	// 	return _generateTOTP(secretKey, Instant.now().getEpochSecond());
	// }

	/**
	 * 判断用户输入的 TOTP 是否有效
	 *
	 * @param {string} secretKey Base32编码的密钥
	 * @param {string} code 用户输入的验证码
	 * @param {int} timeWindowOffset 允许的时间窗口偏移量（如1表示允许前后各1个时间窗口）
	 * @return {boolean} /
	 */
	validateTOTP(secretKey, code, timeWindowOffset) {
		const currentWindow = Math.floor(Date.now() / 1000 / this.timeStep);
		for (let i = -timeWindowOffset; i <= timeWindowOffset; i++) {
            const calculatedCode = this._generateTOTP(secretKey, (currentWindow + i) * this.timeStep);
            if (calculatedCode === code) {
                return true;
            }
        }
        return false;
	}

	/**
	 * 校验用户输入的TOTP是否有效，如果无效则抛出异常
	 *
	 * @param {string} secretKey Base32编码的密钥
	 * @param {string} code 用户输入的验证码
	 * @param {int} timeWindowOffset 允许的时间窗口偏移量（如1表示允许前后各1个时间窗口）
	 */
	checkTOTP(secretKey, code, timeWindowOffset) {
		if (!this.validateTOTP(secretKey, code, timeWindowOffset)) {
			throw new TotpAuthException();
		}
	}

	/**
	 * 生成谷歌认证器的扫码字符串 (形如：otpauth://totp/{account}?secret={secretKey})
	 *
	 * @param {string} account  账户名
	 * @return /
	 */
	// generateGoogleSecretKey(account) {
	// 	return this.generateGoogleSecretKey(account, this.generateSecretKey());
	// }

	/**
	 * 生成谷歌认证器的扫码字符串 (形如：otpauth://totp/{account}?secret={secretKey})
	 *
	 * @param {string} account  账户名
	 * @param {string} secretKey  TOTP 秘钥
	 * @return {string} /
	 */
	// generateGoogleSecretKey(account, secretKey = this.generateSecretKey()) {
	// 	return `otpauth://totp/${encodeURIComponent(account)}?secret=${secretKey}`;
	// 	//return StrFormatter.format("otpauth://totp/{}?secret={}", account, secretKey);
	// }

	/**
	 * 生成谷歌认证器的扫码字符串 (形如：otpauth://totp/{issuer}:{account}?secret={secretKey}&issuer={issuer})
	 *
	 * @param {string} account  账户名
	 * @param {string} issuer  签发者
	 * @param {string} secretKey TOTP 秘钥
	 * @return /
	 */
	generateGoogleSecretKey(account, issuer, secretKey = this.generateSecretKey()) {
		// 如果第二个参数是secretKey（没有issuer的情况）
		if (arguments.length === 2) {
			secretKey = issuer;
			issuer = undefined;
		}
	
		if (issuer) {
			// 有issuer的格式
			return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?secret=${secretKey}&issuer=${encodeURIComponent(issuer)}`;
		} else {
			// 没有issuer的简单格式
			return `otpauth://totp/${encodeURIComponent(account)}?secret=${secretKey}`;
		}
	}

	_generateTOTP(secretKey,time = Math.floor(Date.now() / 1000)) {
		const keyBytes = new Uint8Array(base32Decode.asBytes(secretKey));
        const counter = Math.floor(time / this.timeStep);
        
        const buffer = Buffer.alloc(8);
        buffer.writeBigInt64BE(BigInt(counter), 0);
		try {
            // 计算HMAC哈希
            const hmac = crypto.createHmac(this.hmacAlgorithm, Buffer.from(keyBytes));
            hmac.update(buffer);
            const hash = hmac.digest();

            // 动态截断（RFC 6238）
            const offset = hash[hash.length - 1] & 0xF;
            const binary = ((hash[offset] & 0x7F) << 24) |
                          ((hash[offset + 1] & 0xFF) << 16) |
                          ((hash[offset + 2] & 0xFF) << 8) |
                          (hash[offset + 3] & 0xFF);

            // 生成指定位数的验证码
            const otp = binary % Math.pow(10, this.codeDigits);
            return otp.toString().padStart(this.codeDigits, '0');

        } catch (e) {
            throw new Error('TOTP生成失败', { cause: e });
        }


	// 	// Base32解码密钥
	// 	byte[] keyBytes = SaBase32Util.decodeStringToBytes(secretKey);
	// 	byte[] counterBytes = ByteBuffer.allocate(8).putLong(time / timeStep).array();

	// 	try {
	// 		// 计算HMAC哈希
	// 		Mac hmac = Mac.getInstance(hmacAlgorithm);
	// 		hmac.init(new SecretKeySpec(keyBytes, hmacAlgorithm));
	// 		byte[] hash = hmac.doFinal(counterBytes);

	// 		// 动态截断（RFC 6238）
	// 		int offset = hash[hash.length - 1] & 0xF;
	// 		int binary = ((hash[offset] & 0x7F) << 24)
	// 				| ((hash[offset + 1] & 0xFF) << 16)
	// 				| ((hash[offset + 2] & 0xFF) << 8)
	// 				| (hash[offset + 3] & 0xFF);

	// 		// 生成指定位数的验证码
	// 		int otp = binary % (int) Math.pow(10, codeDigits);
	// 		return String.format("%0" + codeDigits + "d", otp);

	// 	} catch (GeneralSecurityException e) {
	// 		throw new RuntimeException("TOTP生成失败", e);
	// 	}
	}

}

export default SaTotpTemplate;
