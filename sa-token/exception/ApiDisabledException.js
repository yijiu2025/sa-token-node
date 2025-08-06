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

import SaTokenException from "./SaTokenException.js";

/**
 * 一个异常：代表 API 已被禁用
 *
 * <p> 一般在 API 不合适调用的时候抛出，例如在集成 jwt 模块后调用数据持久化相关方法 </p>
 *
 * @author click33
 * @since 1.28.0
 */

class ApiDisabledException extends SaTokenException {
    /**
     * 异常提示语
     */
    static BE_MESSAGE = "this api is disabled";

    /**
     * 一个异常：代表 API 已被禁用  
     */
    /**
     * 构造函数
     * @param {string} [message] 自定义错误信息
     */
    constructor(message = ApiDisabledException.BE_MESSAGE) {
        super(message);
        this.name = 'ApiDisabledException';
        
        // 设置默认错误码（可根据需要修改）
        //this.code = 14001; // 假设140xx系列是API相关错误码
    }
}

// 冻结静态属性
Object.freeze(ApiDisabledException);
Object.freeze(ApiDisabledException.prototype);

export default ApiDisabledException;

