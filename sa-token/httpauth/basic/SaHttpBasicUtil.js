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

import SaHttpBasicTemplate from './SaHttpBasicTemplate.js';

/**
 * Sa-Token Http Basic 认证模块，Util 工具类
 *
 * @author click33
 * @since 1.26.0
 */

class SaHttpBasicUtil {

	constructor() {
        //throw new Error("SaHttpBasicUtil 是工具类，不能实例化");
    }
	
	/**
	 * 底层使用的 SaBasicTemplate 对象
	 */
	static saHttpBasicTemplate = new SaHttpBasicTemplate();

	/**
	 * 获取浏览器提交的 Http Basic 参数 （裁剪掉前缀并解码）
	 * @return 值
	 */
	static getAuthorizationValue() {
        return this.saHttpBasicTemplate.getAuthorizationValue();
    }

	/**
	 * 获取 Http Basic 账号密码对象
	 * @return /
	 */
	static getHttpBasicAccount() {
        return this.saHttpBasicTemplate.getHttpBasicAccount();
    }

    static check(arg1, arg2) {
        if (arguments.length === 0) {
            /**
             * 对当前会话进行 Basic 校验（使用全局配置的账号密码），校验不通过则抛出异常  
             */
            this.saHttpBasicTemplate.check();
        } else if (arguments.length === 1) {
            /**
             * 对当前会话进行 Basic 校验（手动设置账号密码），校验不通过则抛出异常  
             * @param account 账号（格式为 user:password）
             */
            this.saHttpBasicTemplate.check(arg1);
        } else if (arguments.length === 2) {
            /**
             * 对当前会话进行 Basic 校验（手动设置 Realm 和 账号密码），校验不通过则抛出异常 
             * @param realm 领域 
             * @param account 账号（格式为 user:password）
             */
            this.saHttpBasicTemplate.check(arg1.arg2);
        }

    }

}





