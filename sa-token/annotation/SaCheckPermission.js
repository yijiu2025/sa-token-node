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
 * 权限认证校验：必须具有指定权限才能进入该方法。
 *
 * <p> 可标注在方法、类上（效果等同于标注在此类的所有方法上）
 *
 * @author click33 qirly
 * @since 1.10.0
 */
// @Retention(RetentionPolicy.RUNTIME)
// @Target({ElementType.METHOD,ElementType.TYPE})
class SaCheckPermission {

	/**
	 * 多账号体系下所属的账号体系标识，非多账号体系无需关注此值
	 *
	 * @return {String} /
	 */
	type = "";

	/**
	 * 需要校验的权限码 [ 数组 ]
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

	/**
	 * 在权限校验不通过时的次要选择，两者只要其一校验成功即可通过校验
	 * 
	 * <p> 
	 * 	例1：@SaCheckPermission(value="user-add", orRole="admin")，
	 * 	代表本次请求只要具有 user-add权限 或 admin角色 其一即可通过校验。
	 * </p>
	 * 
	 * <p> 
	 * 	例2： orRole = {"admin", "manager", "staff"}，具有三个角色其一即可。 <br>
	 * 	例3： orRole = {"admin, manager, staff"}，必须三个角色同时具备。
	 * </p>
	 * 
	 * @return {String[]} /
	 */
	orRole = [];

}
export default SaCheckPermission;
