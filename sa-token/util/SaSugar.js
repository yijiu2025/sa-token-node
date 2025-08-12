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

import SaFunction from "../fun/SaFunction.js";

/**
 * 代码语法糖封装
 *
 * @author click33 qirly
 * @since 1.43.0
 */
class SaSugar {

	/**
	 * 执行一个 Lambda 表达式，返回这个 Lambda 表达式的结果值，
	 * <br> 方便组织代码，例如: 
	 * <pre> 
	 	int value = Sugar.get(() -> {
			int a = 1;
			int b = 2;
			return a + b;
		});
		</pre> 
	 * @template R
	 * @param {Function} lambda lambda 表达式
	 * @return {R} lambda 的执行结果
	 */
	static get(lambda) {
		return lambda();
	}

	/**
	 * 执行一个 Lambda 表达式 
	 * <br> 方便组织代码，例如: 
	 * <pre> 
	 	Sugar.exe(() -> {
			int a = 1;
			int b = 2;
			return a + b;
		});
		</pre> 
	 * @param {SaFunction} lambda lambda 表达式
	 */
	static exe(lambda) {
		lambda();
	}

}

export default SaSugar;
