'use strict';

var StpInterface = require('./StpInterface.js');

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
 * 对 {@link StpInterface} 接口默认的实现类
 * <p>
 * 如果开发者没有实现 StpInterface 接口，则框架会使用此默认实现类，所有方法都返回空集合，即：用户不具有任何权限和角色。
 * 
 * @author click33
 * @since 1.10.0
 */
class StpInterfaceDefaultImpl extends StpInterface {

	// @Override
	getPermissionList(loginId, loginType) {
		return [];
	}

	// @Override
	getRoleList(loginId, loginType) {
		return [];
	}

}

module.exports = StpInterfaceDefaultImpl;
