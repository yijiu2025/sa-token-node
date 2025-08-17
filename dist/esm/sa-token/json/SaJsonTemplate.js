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
 * JSON 转换器 
 * 
 * @author click33 qirly
 * @since 1.30.0
 */

class SaJsonTemplate {

	/**
	 * 序列化：对象 -> json 字符串
	 *
	 * @param {Object} obj /
	 * @return {String } /
	 */
	objectToJson(obj) {};

	/**
	 * 反序列化：json 字符串 → 对象
	 *
	 * @param {String} jsonStr /
	 * @param {Class<T> } type /
	 * @return /
	 * @param <T> /
	 */
	jsonToObject(jsonStr, type) {};

	// /**
	//  * 反序列化：json 字符串 → 对象 (自动判断类型)
	//  *
	//  * @param {String} jsonStr /
	//  * @return {Object} /
	//  */
	// jsonToObject(jsonStr) {
	// 	return jsonToObject(jsonStr, Object.class);
	// };

	/**
	 * 反序列化：json 字符串 → Map
	 *
	 * @param {String} jsonStr /
	 * @return  {Map<String, Object>}/
	 */
	jsonToMap(jsonStr) {
		return this.jsonToObject(jsonStr, Map);
	};
	
}

export { SaJsonTemplate as default };
