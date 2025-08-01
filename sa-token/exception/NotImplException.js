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

import SaTokenException from "./SaTokenException";

/**
 * 一个异常：代表组件或方法未被提供有效的实现
 * 
 * @author click33
 * @since 1.33.0
 */

class NotImplException extends SaTokenException {
    /**
     * 构造函数  一个异常：代表组件或方法未被提供有效的实现
     * @param {string} message 异常描述信息
     */
    constructor(message = "功能未实现") {
        super(message);
        this.name = 'NotImplException';
        
        // 设置未实现相关的默认错误码
        //this.code = 10003; // CODE_10003 = JSON转换器未实现（可根据需要修改）
    }
}

// 冻结原型防止修改
Object.freeze(NotImplException.prototype);

export default NotImplException;

