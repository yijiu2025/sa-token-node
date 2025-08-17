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

import SaCheckHttpDigest from '../../annotation/SaCheckHttpDigest.js';
import SaHolder from '../../context/SaHolder.js';
import SaHttpDigestTemplate from './SaHttpDigestTemplate.js';
import SaHttpDigestModel from './SaHttpDigestModel.js';

/**
 * Sa-Token Http Digest 认证模块，Util 工具类
 *
 * @author click33 qirly
 * @since 1.38.0
 */

class SaHttpDigestUtil {

    constructor() {
        //throw new Error("SaHttpDigestUtil 是工具类，不能实例化");
    }
	
	/**
	 * 底层使用的 SaHttpDigestTemplate 对象
     * @type {SaHttpDigestTemplate}
	 */
	saHttpDigestTemplate = new SaHttpDigestTemplate();


	/**
	 * 获取浏览器提交的 Digest 参数 （裁剪掉前缀）
	 * @return {string}值
	 */
	static getAuthorizationValue() {
		return this.saHttpDigestTemplate.getAuthorizationValue();
	}

	/**
	 * 获取浏览器提交的 Digest 参数，并转化为 Map
	 * @return  {SaHttpDigestModel}/
	 */
	static  getAuthorizationValueToModel() {
		return this.saHttpDigestTemplate.getAuthorizationValueToModel();
	}

	// ---------- 校验 ----------

	/**
	 * 校验：根据提供 Digest 参数计算 res，与 request 请求中的 Digest 参数进行校验，校验不通过则抛出异常
	 * @param hopeModel 提供的 Digest 参数对象
	 */
    static check(arg1, arg2, arg3) {
        if (arguments.length === 0) {
            /**
             * 校验：根据全局配置参数，校验不通过抛出异常
             */
            this.saHttpDigestTemplate.check();
        } else if (arguments.length === 1) {
            /**
             * 校验：根据提供 Digest 参数计算 res，与 request 请求中的 Digest 参数进行校验，校验不通过则抛出异常
             * @param hopeModel 提供的 Digest 参数对象
             */
            this.saHttpDigestTemplate.check(arg1);
        } else if (arguments.length === 2) {
            /**
             * 校验：根据提供的参数，校验不通过抛出异常
             * @param username 用户名
             * @param password 密码
             */
            this.saHttpDigestTemplate.check(arg1, arg2);
        } else if (arguments.length === 3) {
            /**
             * 校验：根据提供的参数，校验不通过抛出异常
             * @param username 用户名
             * @param password 密码
             * @param realm 领域
             */
            this.saHttpDigestTemplate.check(arg1, arg2, arg3);
        }
    }



	// ----------------- 过期方法 -----------------

	/**
	 * 根据注解 ( @SaCheckHttpDigest ) 鉴权
	 *
	 * @param at 注解对象
	 */
	@Deprecated
	static checkByAnnotation(at) {
		this.saHttpDigestTemplate.checkByAnnotation(at);
	}

}

export default SaHttpDigestUtil;






