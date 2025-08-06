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


import SaTokenException from "../../exception/SaTokenException.js"; 
import SaSerializerTemplate from "../SaSerializerTemplate.js"; 

/**
 * 序列化器次级实现: jdk序列化
 *
 * @author click33
 * @since 1.41.0
 */
class SaSerializerTemplateForJdk extends SaSerializerTemplate {


    /**
	 * 将 Object 对象转换为 String 字符串
	 * @param {Object} obj /
	 * @return {String} /
	 */
	// @Override
	objectToString(obj) {
        const bytes = this.objectToBytes(obj);
        if (bytes == null) {
            return null;
        }
        return this.bytesToString(bytes);
    }

    /**
	 * 将 String 字符串转换为 Object 对象
	 * @param {String} str /
	 * @return {Object} /
	 */
	// @Override
	stringToObject(str) {
        if (str == null) {
            return null;
        }
        const bytes = this.stringToBytes(str);
        return this.bytesToObject(bytes);
    }

    /** 
     * 将 Object 对象转换为 byte[] 字节数组
     * @param {Object} obj /
     * @return {byte[]} /
     */
	// @Override
	objectToBytes(obj) {
		if (obj == null) {
            return null;
        }
        try {
            // Node.js 中没有 Java 的 ObjectOutputStream，使用 JSON 替代
            return new Uint8Array(Buffer.from(JSON.stringify(obj)));
        } catch (e) {
            throw new SaTokenException(e);
        }
	}

    /**
	 * 将 byte[] 字节数组转换为 Object 对象
	 * @param {byte[]} bytes /
	 * @return {Object} /
	 */
	// @Override
	bytesToObject(bytes) {
		if (bytes == null) {
            return null;
        }
        try {
            // Node.js 中没有 Java 的 ObjectInputStream，使用 JSON 替代
            return JSON.parse(Buffer.from(bytes).toString());
        } catch (e) {
            throw new SaTokenException(e);
        }
		// try (
		// 	ByteArrayInputStream bais = new ByteArrayInputStream(bytes);
		// 	ObjectInputStream ois = new ObjectInputStream(bais)
		// ) {
		// 	return ois.readObject();
		// } catch (IOException | ClassNotFoundException e) {
		// 	throw new SaTokenException(e);
		// }
	}

	/**
	 * byte[] 转换为 String
	 * @param {byte[]} bytes /
	 * @return {String} /
	 */
	bytesToString(bytes) {
		throw new Error("Method bytesToString() must be implemented by subclass");
	};

	/**
	 * String 转换为 byte[]
	 * @param {String} str /
	 * @return {byte[]} /
	 */
	stringToBytes(str) {
		throw new Error("Method stringToBytes() must be implemented by subclass");
	};

}

export default SaSerializerTemplateForJdk;