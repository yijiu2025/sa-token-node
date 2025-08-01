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
 * 一个异常：代表插件安装过程中出现异常
 *
 * @author click33
 * @since 1.28.0
 */

class SaTokenPluginException extends SaTokenException {
    constructor(arg1, arg2) {
        // 处理三种构造方式
        
        if (typeof arg1 === 'string' && !arg2) {
            // SaTokenPluginException(String message)
            super(arg1);
        } else if (arg1 instanceof Error && !arg2) {
            // SaTokenPluginException(Throwable cause)
            super(arg1);
        } else if (typeof arg1 === 'string' && arg2 instanceof Error) {
            // SaTokenPluginException(String message, Throwable cause)
            super(arg1,arg2);
        } else {
            throw new Error('Invalid arguments for SaTokenPluginException');
        }

        this.name = 'SaTokenPluginException';
        
        // if (cause) {
        //     this.cause = cause;
        //     this.stack = `${this.stack}\nCaused by: ${cause.stack}`;
        // }
    }
}

export default SaTokenPluginException;