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
 * 序列化器: jdk序列化、ISO-8859-1 编码 (体积无变化)
 *
 * @author click33
 * @since 1.41.0
 */
class SaSerializerTemplateForJdkUseISO_8859_1 extends SaSerializerTemplateForJdk {

    /**
     * 将 byte[] 对象转换为 String 字符串
     * @param {byte[]} bytes /
     * @return {String} /
     */
	// @Override
	bytesToString(bytes) {
        // Node.js 中 latin1 即 ISO-8859-1
        return Buffer.from(bytes).toString('latin1');
		//return new String(bytes, StandardCharsets.ISO_8859_1);
	}

    /**
     * 将 String 字符串转换为 byte[] 对象
     * @param {String} str /
     * @return {byte[]} /
     */ 
	// @Override
	stringToBytes(str) {
        // Node.js 中 latin1 即 ISO-8859-1
        return new Uint8Array(Buffer.from(str, 'latin1'));
		//return str.getBytes(StandardCharsets.ISO_8859_1);
	}

}
export default SaSerializerTemplateForJdkUseISO_8859_1;