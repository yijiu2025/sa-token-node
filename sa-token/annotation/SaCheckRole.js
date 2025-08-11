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

import SaMode from "./SaMode.js";

/**
 * 角色认证校验：必须具有指定角色标识才能进入该方法。
 *
 * <p> 可标注在方法、类上（效果等同于标注在此类的所有方法上）
 *
 * @author click33 qirly
 * @since 1.10.0
 */
// @Retention(RetentionPolicy.RUNTIME)
// @Target({ElementType.METHOD,ElementType.TYPE})
class SaCheckRole {

	/**
	 * 多账号体系下所属的账号体系标识，非多账号体系无需关注此值
	 *
	 * @return {String} /
	 */
	type = "";

	/**
	 * 需要校验的角色标识 [ 数组 ]
	 *
	 * @return {String[]} /
	 */
	value = [];

	/**
	 * 验证模式：AND | OR，默认AND
	 *
	 * @return {SaMode} /
	 */
	mode = SaMode.AND;

}

export default SaCheckRole;
