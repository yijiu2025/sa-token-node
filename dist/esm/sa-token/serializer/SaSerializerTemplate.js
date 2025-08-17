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
 * 序列化器
 * 
 * @author click33
 * @since 1.41.0
 */
class SaSerializerTemplate {

	/**
	 * 序列化：对象 -> 字符串
	 *
	 * @param {Object} obj /
	 * @return {String} /
	 */
	objectToString(obj) {
        
    };

	/**
	 * 反序列化：字符串 → 对象
	 *
	 * @param {String} str /
     * @param {Class<T>} type /
	 * @return {Object} /
	 */
	stringToObject(str, type) {};

	// /**
	//  * 反序列化：字符串 → 对象 (指定类型)
	//  * <p>
	//  *     此方法目前仅为 json 序列化实现类 在 反序列化对象 传递类型信息
	//  * </p>
	//  *
	//  * @param {String} str /
    //  * @param {Class<T>} type /
	//  * @return {<T> T} /
	//  */
	// // @SuppressWarnings("unchecked")
	// stringToObject(str, type) {
    //      return stringToObject(str);
    // };


	/**
	 * 序列化：对象 -> 字节数组
	 *
	 * @param {Object} obj /
	 * @return {byte[]} /
	 */
	objectToBytes(obj) {};

	/**
	 * 反序列化：字节数组 → 对象
	 *
	 * @param {byte[]} bytes /
	 * @return {Object} /
	 */
	bytesToObject(bytes) {};

}

export { SaSerializerTemplate as default };
