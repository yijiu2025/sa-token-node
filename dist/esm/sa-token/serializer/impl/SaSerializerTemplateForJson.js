import SaManager from '../../SaManager.js';
import ApiDisabledException from '../../exception/ApiDisabledException.js';
import SaSerializerTemplate from '../SaSerializerTemplate.js';

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
 * 序列化器: 使用 json 转换器
 *
 * @author click33 qirly
 * @since 1.41.0
 */
class SaSerializerTemplateForJson extends SaSerializerTemplate {

    /**
     * 将 Object 对象转换为 String 字符串
     * @param {Object} obj /
     * @return {String} /
     */
	// @Override
	objectToString(obj) {
		return SaManager.getSaJsonTemplate().objectToJson(obj);
	}

    // /**
    //  * 将 String 字符串转换为 Object 对象
    //  * @param {String} str /
    //  * @return {Object} /
    //  */
	// // @Override
	// stringToObject(str) {
	// 	return SaManager.getSaJsonTemplate().jsonToObject(str);
	// }

    /**
     * 将 String 字符串转换为 Object 对象
     * @param {String} str /
     * @param {Class<T>} type /
     * @return {Object} /
     */
	// @Override
	stringToObject(str, type) {
		return SaManager.getSaJsonTemplate().jsonToObject(str, type);
	}

    /**
     * 将 Object 对象转换为 byte[] 对象
     * @param {Object} obj /
     * @return {byte[]} /
     */
	// @Override
	objectToBytes(obj) {
		throw new ApiDisabledException("json 序列化器不支持 Object -> byte[]");
	}

    /**
     * 将 byte[] 对象转换为 Object 对象
     * @param {byte[]} bytes /
     * @return {Object} /
     */
	// @Override
	bytesToObject(bytes) {
		throw new ApiDisabledException("json 序列化器不支持 byte[] -> Object");
	}

}

export { SaSerializerTemplateForJson as default };
