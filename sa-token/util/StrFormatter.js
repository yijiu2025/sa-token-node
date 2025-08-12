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
 * 字符串格式化工具，将字符串中的 {} 按序替换为参数
 * <p>
 * 	本工具类 copy 自 Hutool：
 * 		https://github.com/dromara/hutool/blob/v5-master/hutool-core/src/main/java/cn/hutool/core/text/StrFormatter.java
 * </p>
 *
 * @author Looly qirly
 * @since 1.33.0
 */
class StrFormatter {

	/**
	 * 占位符 
	 */
	static EMPTY_JSON = "{}";

	static C_BACKSLASH = '\\';

	/**
	 * 格式化字符串<br>
	 * 此方法只是简单将占位符 {} 按照顺序替换为参数<br>
	 * 如果想输出 {} 使用 \\转义 { 即可，如果想输出 {} 之前的 \ 使用双转义符 \\\\ 即可<br>
	 * 例：<br>
	 * 通常使用：format("this is {} for {}", "a", "b") =》 this is a for b<br>
	 * 转义{}： format("this is \\{} for {}", "a", "b") =》 this is \{} for a<br>
	 * 转义\： format("this is \\\\{} for {}", "a", "b") =》 this is \a for b<br>
	 *
	 * @param {String} strPattern 字符串模板
	 * @param {Object...} argArray   参数列表
	 * @return {string} 结果
	 */
    static format(strPattern, ...argArray) {
		return StrFormatter.formatWith(strPattern, StrFormatter.EMPTY_JSON, ...argArray);
	}
	// public static String format(String strPattern, Object... argArray) {
	// 	return formatWith(strPattern, EMPTY_JSON, argArray);
	// }

	/**
	 * 格式化字符串<br>
	 * 此方法只是简单将指定占位符 按照顺序替换为参数<br>
	 * 如果想输出占位符使用 \\转义即可，如果想输出占位符之前的 \ 使用双转义符 \\\\ 即可<br>
	 * 例：<br>
	 * 通常使用：format("this is {} for {}", "{}", "a", "b") =》 this is a for b<br>
	 * 转义{}： format("this is \\{} for {}", "{}", "a", "b") =》 this is {} for a<br>
	 * 转义\： format("this is \\\\{} for {}", "{}", "a", "b") =》 this is \a for b<br>
	 *
	 * @param {String} strPattern  字符串模板
	 * @param {String} placeHolder 占位符，例如{}
	 * @param {Object...} argArray    参数列表
	 * @return {String} 结果
	 * @since 1.33.0
	 */
	static formatWith(strPattern, placeHolder, ...argArray) {
		if (SaFoxUtil.isEmpty(strPattern) || SaFoxUtil.isEmpty(placeHolder)) {
			return strPattern;
		}
		const strPatternLength = strPattern.length;
		const placeHolderLength = placeHolder.length;

		// 初始化定义好的长度以获得更好的性能
        const sbu = [];
		//const sbu = new StringBuilder(strPatternLength + 50);

		let handledPosition = 0;// 记录已经处理到的位置
		let delimIndex;// 占位符所在位置
		for (let argIndex = 0; argIndex < argArray.length; argIndex++) {
			delimIndex = strPattern.indexOf(placeHolder, handledPosition);
			if (delimIndex === -1) {// 剩余部分无占位符
				if (handledPosition === 0) { // 不带占位符的模板直接返回
					return strPattern;
				}
				// 字符串模板剩余部分不再包含占位符，加入剩余部分后返回结果
				sbu.push(strPattern.substring(handledPosition, strPatternLength));
				return sbu.join("");
			}

			// 转义符
			if (delimIndex > 0 && strPattern.charAt(delimIndex - 1) === StrFormatter.C_BACKSLASH) {// 转义符
				if (delimIndex > 1 && strPattern.charAt(delimIndex - 2) === StrFormatter.C_BACKSLASH) {// 双转义符
					// 转义符之前还有一个转义符，占位符依旧有效
					sbu.push(strPattern.substring(handledPosition, delimIndex - 1));
					sbu.push(argArray[argIndex]);
					handledPosition = delimIndex + placeHolderLength;
				} else {
					// 占位符被转义
					argIndex--;
					sbu.push(strPattern.substring(handledPosition, delimIndex - 1));
					sbu.push(placeHolder.charAt(0));
					handledPosition = delimIndex + 1;
				}
			} else {// 正常占位符
				sbu.push(strPattern.substring(handledPosition, delimIndex));
				sbu.push(argArray[argIndex]);
				handledPosition = delimIndex + placeHolderLength;
			}
		}

		// 加入最后一个占位符后所有的字符
		sbu.push(strPattern.substring(handledPosition, strPatternLength));

		return sbu.join("");
	}

}

export default StrFormatter;
