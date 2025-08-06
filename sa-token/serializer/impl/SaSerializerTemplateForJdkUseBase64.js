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

import SaSerializerTemplateForJdk from "./SaSerializerTemplateForJdk.js";

/**
 * 序列化器: jdk序列化、Base64 编码 (体积+33%)
 *
 * @author click33
 * @since 1.41.0
 */
class SaSerializerTemplateForJdkUseBase64 extends SaSerializerTemplateForJdk {

    /**
     * 将 byte[] 对象转换为 String 字符串
     * @param {byte[]} bytes /
     * @return {String} /
     */
	// @Override
	bytesToString(bytes) {
        return bytes.toString('base64');
		// return Base64.getEncoder().encodeToString(bytes);
	}

    /**
     * 将 String 字符串转换为 byte[] 对象
     * @param {String} str /
     * @return {byte[]} /
     */
	// @Override
	stringToBytes(str) {
        return Buffer.from(str, 'base64');
		//return Base64.getDecoder().decode(str);
	}

}