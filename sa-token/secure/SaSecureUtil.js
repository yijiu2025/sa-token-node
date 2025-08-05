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

import crypto from 'crypto';
import CryptoJS from "crypto-js"
import { Buffer } from 'buffer';
import jsSHA from 'jssha';
// const crypto = require('crypto');
// const { Buffer } = require('buffer');
import SaErrorCode from "../error/SaErrorCode.js";
import SaTokenException from "../exception/SaTokenException.js";

/**
 * Sa-Token 常见加密算法工具类
 *
 * @author click33
 * @since 1.14.0
 */
class SaSecureUtil {

	constructor() { throw new Error('Cannot instantiate static class'); }

	// ----------------------- 摘要加密 -----------------------

	/**
	 * md5加密
	 * @param {string} str str 指定字符串
	 * @return {string} 加密后的字符串
	 */

    /**
     * Node.js 环境下的同步 MD5，结构对齐 Java
     */

    // static md51(str) {
    //     str = (str == null ? '' : String(str));
    //     const hexDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

    //     try {
    //         const btInput = Buffer.from(str, 'utf8');
    //         const hash = crypto.createHash('md5');
    //         hash.update(btInput);
    //         const md = hash.digest(); // 返回 Buffer，可当字节数组用

    //         const j = md.length;
    //         const strA = new Array(j * 2);
    //         let k = 0;

    //         for (let i = 0; i < j; i++) {
    //             const byte0 = md[i];
    //             strA[k++] = hexDigits[(byte0 >>> 4) & 0xf];
    //             strA[k++] = hexDigits[byte0 & 0xf];
    //         }

    //         return strA.join('');
    //     } catch (e) {
    //         throw new SaTokenException(e).setCode(SaErrorCode.CODE_12111);
    //     }
    // }

    static md5(str) {
        str = str == null ? '' : String(str);
        try {
            return crypto.createHash('md5').update(str, 'utf8').digest('hex');
        } catch (e) {
            throw new SaTokenException(e).setCode(SaErrorCode.CODE_12111);
        }
    }


	/**
	 * sha1加密
	 *
	 * @param {string|null} str 指定字符串
	 * @return {string} 加密后的字符串
	 */
	static sha1(str) {
        str = str == null ? '' : String(str);
        try {
            return crypto.createHash('sha1').update(str, 'utf8').digest('hex');
        } catch (e) {
            throw new SaTokenException(e).setCode(SaErrorCode.CODE_12112);
        }
    }


	/**
	 * sha256加密
	 *
	 * @param {string} str 指定字符串
	 * @return {string} 加密后的字符串
	 */
	static sha256(str) {
        str = str == null ? '' : String(str);
        try {
            return crypto.createHash('sha256').update(str, 'utf8').digest('hex');
        } catch (e) {
            throw new SaTokenException(e).setCode(SaErrorCode.CODE_12113);
        }
    }


	/**
	 * sha384加密
	 *
	 * @param {string} str 指定字符串
	 * @return {string} 加密后的字符串
	 */

	static sha384(str) {
        str = str == null ? '' : String(str);
        try {
            return crypto.createHash('sha384').update(str, 'utf8').digest('hex');
        } catch (e) {
            throw new SaTokenException(e).setCode(SaErrorCode.CODE_121131);
        }
    }


	/**
	 * sha512加密
	 *
	 * @param {string} str 指定字符串
	 * @return {string} 加密后的字符串
	 */

	static sha512(str) {
        str = str == null ? '' : String(str);
        try {
            return crypto.createHash('sha512').update(str, 'utf8').digest('hex');
        } catch (e) {
            throw new SaTokenException(e).setCode(SaErrorCode.CODE_121132);
        }
    }


	// /**
	//  * sha (Secure Hash Algorithm)加密 公共方法
	//  *
	//  * @param str 指定字符串
	//  * @param messageDigest 消息摘要
	//  * @return 加密后的字符串
	//  */
	// private static String getShaHexString(String str, MessageDigest messageDigest) {
	// 	messageDigest.update(str.getBytes(StandardCharsets.UTF_8));
	// 	byte[] bytes = messageDigest.digest();
	// 	StringBuilder builder = new StringBuilder();
	// 	String temp;
	// 	for (byte aByte : bytes) {
	// 		temp = Integer.toHexString(aByte & 0xFF); // 获取无符号整数十六进制字符串
	// 		if (temp.length() == 1) {
	// 			builder.append("0"); // 确保每个字节都用两个字符表示
	// 		}
	// 		builder.append(temp);
	// 	}

	// 	return builder.toString();
	// }

	/**
	 * md5加盐加密: md5(md5(str) + md5(salt))
	 * @param {string} str 字符串
	 * @param {string} salt 盐
	 * @return {string} 加密后的字符串
	 */
	// @Deprecated
	static md5BySalt(str, salt) {
		return SaSecureUtil.md5(SaSecureUtil.md5(str) + SaSecureUtil.md5(salt));
	}

	/**
	 * sha256加盐加密: sha256(sha256(str) + sha256(salt))
	 * @param {string} str 字符串
	 * @param {string} salt 盐
	 * @return {string} 加密后的字符串
	 */
	// @Deprecated
	static sha256BySalt(str, salt) {
		return SaSecureUtil.sha256(SaSecureUtil.sha256(str) + SaSecureUtil.sha256(salt));
	}

	// ----------------------- 对称加密 AES -----------------------

    /**
     * 默认密码算法
     */
    static DEFAULT_CIPHER_ALGORITHM = "AES/ECB/PKCS5Padding";

    /**
     * AES加密
     *
     * @param {string} key 加密的密钥
     * @param {string} text  需要加密的字符串
     * @return {string} 返回Base64转码后的加密数据
     */
	static aesEncrypt(key, text) {
		try {
			//1. 生成密钥 (16字节，对应AES-128)
			const secretKey = this.getSecretKey(key);
			// console.log('密钥 (hex):', secretKey.toString('hex')); // 打印密钥
			
			//2. 创建加密器 (使用ECB模式，不推荐但兼容原Java代码)
			const cipher = crypto.createCipheriv('aes-128-ecb', secretKey, null);
			cipher.setAutoPadding(true); // 自动PKCS7填充(等同Java的PKCS5)
			
			// 3. 执行加密
			let encrypted = cipher.update(text, 'utf8', 'base64');
			encrypted += cipher.final('base64');
			// 解码 Base64 得到原始字节，再转 hex
			// const rawCipher = Buffer.from(encrypted, 'base64');
			// console.log('密文 (hex):', rawCipher.toString('hex'));
			// console.log('Base64:', encrypted);
			return encrypted;

		} catch (e) {
			throw new SaTokenException(e).setCode(SaErrorCode.CODE_12114);
			// 可自定义错误码，如: throw { code: '12114', message: '加密失败' };
		}
	}

    /**
     * AES解密
     * @param {string} key 加密的密钥
     * @param {string} text 已加密的密文
     * @return {string} 返回解密后的数据
     */
	static aesDecrypt(key, base64Text) {
		try {
			// 1. 生成密钥（必须与加密时相同）
			const secretKey = this.getSecretKey(key);
	
			// 2. 创建解密器（ECB模式，无IV）
			const decipher = crypto.createDecipheriv('aes-128-ecb', secretKey, null);
			decipher.setAutoPadding(true); // 启用PKCS7填充（兼容Java的PKCS5）
	
			// 3. 执行解密（Base64输入 → UTF-8输出）
			let decrypted = decipher.update(base64Text, 'base64', 'utf8');
			decrypted += decipher.final('utf8');
	
			return decrypted;
		} catch (e) {
			// 模拟原Java的错误处理（可自定义错误码）
			throw new SaTokenException(e).setCode(SaErrorCode.CODE_12115);
		}
	}


    /**
     * 生成加密秘钥
     * @param {string} password 秘钥
     * @return {Buffer} SecretKeySpec
	 */
	static getSecretKey(password) {

		const passwordHex = Buffer.from(password, 'utf8').toString('hex');
        //console.log(`pass (hex): ${passwordHex}`); // 输出: pass (hex): 74657374313233
		const seed = Buffer.from(password, 'utf8');

		// 生成16字节密钥
		let state = crypto.createHash('sha1').update(seed).digest();
		const result = [];

		while (result.length < 16) {
			// 更新状态（Java的SHA1PRNG内部实现逻辑）
			state = crypto.createHash('sha1').update(state).digest();
			result.push(...state.slice(0, Math.min(16 - result.length, state.length)));
		}

        const keyBytes = Buffer.from(result.slice(0, 16)); 
        
        //console.log('AES密钥 (Hex):', keyBytes.toString('hex')); 
        
        return keyBytes;
	}


	// // ----------------------- 非对称加密 RSA -----------------------

	static ALGORITHM = "RSA";

	static KEY_SIZE = 1024;


	// ---------- 5个常用方法

	/**
	 * 生成密钥对
	 * @return {Map<String, String>} Map对象 (private=私钥, public=公钥)
	 * @throws Exception 异常
	 */
	// @Deprecated
	static rsaGenerateKeyPair() {
		try {
            const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 1024,
                publicKeyEncoding: { type: 'spki', format: 'der' },
                privateKeyEncoding: { type: 'pkcs8', format: 'der' },
            });

            return {
                private: Buffer.from(privateKey).toString('base64'),
                public: Buffer.from(publicKey).toString('base64')
            };
        } catch (e) {
            throw new SaTokenException(e.message).setCode(SaErrorCode.CODE_12116);
        }
	}

	/**
	 * RSA公钥加密
	 * @param {string} publicKeyString 公钥
	 * @param {string} content 内容
	 * @return {string} 加密后内容
	 */
	// @Deprecated
	static rsaEncryptByPublic(publicKeyString, content) {
		try {
			// 获得公钥对象
			const publicKeyDer = Buffer.from(publicKeyString, 'base64');
            const buffer = Buffer.from(content, 'utf8');
            const key = crypto.createPublicKey({
                key: publicKeyDer,
                format: 'der',
				type: 'spki'  // X.509 标准
            });

            // RSA 最大加密长度 = 密钥长度/8 - 11
            const maxLength = Math.floor(key.asymmetricKeyDetails.modulusLength / 8) - 11;
            const chunks = [];
            for (let i = 0; i < buffer.length; i += maxLength) {
                const chunk = buffer.slice(i, i + maxLength);
                const encrypted = crypto.publicEncrypt({
					key: key,
					padding: crypto.constants.RSA_PKCS1_PADDING // 明确指定填充
				}, chunk);
                chunks.push(encrypted.toString('hex'));
            }
            return chunks.join('');
		} catch (e) {
			throw new SaTokenException(e).setCode(SaErrorCode.CODE_12116);
		}
	}

	/**
	 * RSA私钥加密
	 * @param {string} privateKeyString 私钥
	 * @param {string} content 内容
	 * @return {string} 加密后内容
	 */
	// @Deprecated
	static rsaEncryptByPrivate(privateKeyString, content) {
		try {
			const privateKeyDer = Buffer.from(privateKeyString, 'base64');
			const privateKey = crypto.createPrivateKey({
				key: privateKeyDer,
				format: 'der',
				type: 'pkcs8'
			});

			const modulusLength = privateKey.asymmetricKeyDetails.modulusLength;
			const maxLength = Math.floor(modulusLength / 8) - 11;
			
			const buffer = Buffer.from(content, 'utf8');
			const chunks = [];
			
			for (let i = 0; i < buffer.length; i += maxLength) {
				const chunk = buffer.slice(i, i + maxLength);
				const encrypted = crypto.privateEncrypt({
					key: privateKey,
					padding: crypto.constants.RSA_PKCS1_PADDING // 明确指定填充
				}, chunk);
				chunks.push(encrypted.toString('hex'));
			}
			
			return chunks.join('');
		} catch (e) {
			throw new SaTokenException(e).setCode(SaErrorCode.CODE_12117);
		}
	}

	/**
	 * RSA公钥解密
	 * @param {string} publicKeyString 公钥
	 * @param {string} content 已加密内容
	 * @return {string} 解密后内容
	 */
	// @Deprecated
	static rsaDecryptByPublic(publicKeyString, content) {

		try {
			const publicKeyDer = Buffer.from(publicKeyString, 'base64');
			const publicKey = crypto.createPublicKey({
				key: publicKeyDer,
				format: 'der',
				type: 'spki'
			});

			const modulusLength = publicKey.asymmetricKeyDetails.modulusLength;
			const chunkSize = Math.floor(modulusLength / 8);
			
			// 将十六进制字符串分割成加密块
			const encryptedChunks = [];
			for (let i = 0; i < content.length; i += chunkSize * 2) {
				encryptedChunks.push(content.substr(i, chunkSize * 2));
			}
			
			let result = '';
			for (const chunk of encryptedChunks) {
				const buffer = Buffer.from(chunk, 'hex');
				const decrypted = crypto.publicDecrypt({
					key: publicKey,
					padding: crypto.constants.RSA_PKCS1_PADDING // 明确指定填充
				}, buffer);
				result += decrypted.toString('utf8');
			}
			
			return result;
		} catch (e) {
			throw new SaTokenException(e).setCode(SaErrorCode.CODE_12118);
		}
	}

	/**
	 * RSA私钥解密
	 * @param {string} privateKeyString 私钥
	 * @param {string} content 已加密内容
	 * @return {string} 解密后内容
	 */
	// @Deprecated
	static rsaDecryptByPrivate(privateKeyString, content) {
		try {
			const privateKeyDer = Buffer.from(privateKeyString, 'base64');
			const privateKey = crypto.createPrivateKey({
				key: privateKeyDer,
				format: 'der',
				type: 'pkcs8'
			});

			const modulusLength = privateKey.asymmetricKeyDetails.modulusLength;
			const chunkSize = Math.floor(modulusLength / 8);
			
			// 将十六进制字符串分割成加密块
			const encryptedChunks = [];
			for (let i = 0; i < content.length; i += chunkSize * 2) {
				encryptedChunks.push(content.substr(i, chunkSize * 2));
			}
			
			let result = '';
			for (const chunk of encryptedChunks) {
				const buffer = Buffer.from(chunk, 'hex');
				const decrypted = crypto.privateDecrypt({
					key: privateKey,
					padding: crypto.constants.RSA_PKCS1_PADDING // 明确指定填充
				}, buffer);
				result += decrypted.toString('utf8');
			}
			
			return result;
		} catch (e) {
			throw new SaTokenException(e).setCode(SaErrorCode.CODE_12119);
		}
	}


	// ---------- 获取*钥

	// /** 根据公钥字符串获取 公钥对象 */
	// static getPublicKeyFromString(key) {

	// 	// 过滤掉\r\n
	// 	key = key.replace("\r\n", "");

	// 	// 取得公钥
	// 	X509EncodedKeySpec x509KeySpec = new X509EncodedKeySpec(decoder.decode(key));

	// 	KeyFactory keyFactory = KeyFactory.getInstance(ALGORITHM);

	// 	return keyFactory.generatePublic(x509KeySpec);
	// }

	// /** 根据私钥字符串获取 私钥对象 */
	// private static PrivateKey getPrivateKeyFromString(String key)
	// 		throws NoSuchAlgorithmException, InvalidKeySpecException {

	// 	// 过滤掉\r\n
	// 	key = key.replace("\r\n", "");

	// 	// 取得私钥
	// 	PKCS8EncodedKeySpec x509KeySpec = new PKCS8EncodedKeySpec(decoder.decode(key));

	// 	KeyFactory keyFactory = KeyFactory.getInstance(ALGORITHM);

	// 	return keyFactory.generatePrivate(x509KeySpec);
	// }


	// // ---------- 一些辅助方法

	// /** 根据限定的每组字节长度，将字节数组分组 */
	// private static byte[][] splitBytes(byte[] bytes, int splitLength) {

	// 	// bytes与splitLength的余数
	// 	int remainder = bytes.length % splitLength;
	// 	// 数据拆分后的组数，余数不为0时加1
	// 	int quotient = remainder != 0 ? bytes.length / splitLength + 1 : bytes.length / splitLength;
	// 	byte[][] arrays = new byte[quotient][];
	// 	byte[] array;
	// 	for (int i = 0; i < quotient; i++) {
	// 		// 如果是最后一组（quotient-1）,同时余数不等于0，就将最后一组设置为remainder的长度
	// 		if (i == quotient - 1 && remainder != 0) {
	// 			array = new byte[remainder];
	// 			System.arraycopy(bytes, i * splitLength, array, 0, remainder);
	// 		} else {
	// 			array = new byte[splitLength];
	// 			System.arraycopy(bytes, i * splitLength, array, 0, splitLength);
	// 		}
	// 		arrays[i] = array;
	// 	}
	// 	return arrays;
	// }

	// /** 将字节数组转换成16进制字符串 */
	// private static String bytesToHexString(byte[] bytes) {

	// 	StringBuilder sb = new StringBuilder(bytes.length);
	// 	String temp;
	// 	for (byte aByte : bytes) {
	// 		temp = Integer.toHexString(0xFF & aByte);
	// 		if (temp.length() < 2) {
	// 			sb.append(0);
	// 		}
	// 		sb.append(temp);
	// 	}
	// 	return sb.toString();
	// }

	// /** 将16进制字符串转换成字节数组 */
	// private static byte[] hexStringToBytes(String hex) {

	// 	int len = (hex.length() / 2);
	// 	hex = hex.toUpperCase();
	// 	byte[] result = new byte[len];
	// 	char[] chars = hex.toCharArray();
	// 	for (int i = 0; i < len; i++) {
	// 		int pos = i * 2;
	// 		result[i] = (byte) (toByte(chars[pos]) << 4 | toByte(chars[pos + 1]));
	// 	}
	// 	return result;
	// }

	// /** 将char转换为byte */
	// private static byte toByte(char c) {

	// 	return (byte) "0123456789ABCDEF".indexOf(c);
	// }


}

export default SaSecureUtil;