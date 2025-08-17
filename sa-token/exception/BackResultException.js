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
 * 一个异常：代表停止匹配，直接退出，向前端输出结果 （框架内部专属异常，一般情况下开发者无需关注）
 * 
 * @author click33 qirly
 * @since 1.21.0 
 */

class BackResultException extends SaTokenException {
    /**
     * 要输出的结果
     */
    result = null;

    /**
     * 构造函数
     * @param {*} result 要输出的结果对象
     */
    constructor(result) {
        super(String(result));
        this.result = result;
        this.name = 'BackResultException';
        
        // 设置一个默认的错误码（可根据需要修改）
        //this.code = 15001; // 假设150xx系列是结果返回相关错误码
    }
}

// 冻结原型防止修改
Object.freeze(BackResultException.prototype);

export default BackResultException;



