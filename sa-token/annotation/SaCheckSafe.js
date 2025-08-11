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

import SaTokenConsts from "../util/SaTokenConsts.js";

/**
 * 二级认证校验：客户端必须完成二级认证之后，才能进入该方法，否则将被抛出异常。
 * 
 * <p> 可标注在方法、类上（效果等同于标注在此类的所有方法上）。
 *
 * @author click33 qirly
 * @since 1.21.0
 */
// @Retention(RetentionPolicy.RUNTIME)
// @Target({ ElementType.METHOD, ElementType.TYPE })
class SaCheckSafe {

	/**
	 * 多账号体系下所属的账号体系标识，非多账号体系无需关注此值
	 *
	 * @return {String} /
	 */
	type = "";

	/**
	 * 要校验的服务
	 *
	 * @return {String} /
	 */
	value = SaTokenConsts.DEFAULT_SAFE_AUTH_SERVICE;

}
export default SaCheckSafe;
