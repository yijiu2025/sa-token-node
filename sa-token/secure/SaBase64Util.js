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
 * Sa-Token Base64 工具类
 *
 * @author click33
 * @since 1.14.0
 */
class SaBase64Util {

	// private static final Base64.Encoder encoder = Base64.getEncoder();
	// private static final Base64.Decoder decoder = Base64.getDecoder();
	
	/**
	 * Base64编码，byte[] 转 String
	 * @param bytes byte[]
	 * @return 字符串
	 */
	static encodeBytesToString(bytes) {
		return Buffer.from(bytes).toString('base64');
	}

	/**
	 * Base64解码，String 转 byte[]
	 * @param text 字符串
	 * @return byte[]
	 */
	static decodeStringToBytes(text) {
		return new Uint8Array(Buffer.from(text, 'base64'));
	}
	
	/**
	 * Base64编码，String 转 String
	 * @param text 字符串
	 * @return Base64格式字符串
	 */
	static encode(text) {
		return Buffer.from(text, 'utf8').toString('base64');
	}

	/**
	 * Base64解码，String 转 String
	 * @param base64Text Base64格式字符串
	 * @return 字符串
	 */
	static decode(base64Text) {
		return Buffer.from(base64Text, 'base64').toString('utf8');
	}
	
}
