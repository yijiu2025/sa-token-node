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

import SaTokenException from '../../exception/SaTokenException.js';
import SaFoxUtil from '../../util/SaFoxUtil.js';

/**
 * Sa-Token Http Basic 账号
 *
 * @author click33 qirly
 * @since 1.41.0
 */

class SaHttpBasicAccount {

	/**
	 * 账号
	 */
	username;

	/**
	 * 密码
	 */
	password;

    /**
   * 构造 HTTP 基础认证账号对象
   * @param {string|Object} arg1 用户名或"username:password"格式字符串
   * @param {string} [arg2] 密码（当第一个参数是用户名时使用）
   */
    constructor(arg1, arg2) {
        if (typeof arg1 === 'string' && arg2 === undefined) {
            // 处理 "username:password" 格式的构造函数
            this._parseUsernameAndPassword(arg1);
        } else if (typeof arg1 === 'string' && typeof arg2 === 'string') {
            // 处理 (username, password) 格式的构造函数
            this.username = arg1;
            this.password = arg2;
        } else {
            throw new SaTokenException('无效的构造函数参数');
        }
    }

    /**
     * 解析 "username:password" 格式字符串
     * @param {string} usernameAndPassword 
     * @private
     */
    _parseUsernameAndPassword(usernameAndPassword) {
        if (SaFoxUtil.isEmpty(usernameAndPassword)) {
            throw new SaTokenException('UsernameAndPassword 不能为空');
        }
        
        const arr = usernameAndPassword.split(':');
        if (arr.length !== 2) {
            throw new SaTokenException("UsernameAndPassword 格式错误，正确格式为：username:password");
        }
        
        this.username = arr[0];
        this.password = arr[1];
    }
    

	/**
	 * 获取 账号
	 *
	 * @return {String} username 账号
	 */
	getUsername() {
		return this.username;
	}

	/**
	 * 设置 账号
	 *
	 * @param {String} username  账号
	 */
	setUsername(username) {
		this.username = username;
	}

	/**
	 * 获取 密码
	 *
	 * @return {String} password 密码
	 */
	getPassword() {
		return this.password;
	}

	/**
	 * 设置 密码
	 *
	 * @param {String} password 密码
	 */
	setPassword(password) {
		this.password = password;
	}

	@Override
	toString() {
        return `SaHttpBasicAccount{username='${this.username}', password='${this.password}'}`;
		// return "SaHttpBasicAccount{" +
		// 		"username='" + username + '\'' +
		// 		", password='" + password + '\'' +
		// 		'}';
	}

}

export default SaHttpBasicAccount;



