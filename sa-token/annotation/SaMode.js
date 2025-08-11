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
 * 注解鉴权的验证模式
 *
 * @author click33 qirly
 * @since 1.10.0
 */
class SaMode {
	/**
	 * 必须具有所有的元素 
	 */
	static AND = "AND";

	/**
	 * 只需具有其中一个元素
	 */
	static OR = "OR";
}

export default SaMode;
