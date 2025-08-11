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

import SaCheckHttpDigest from "../SaCheckHttpDigest.js";
import SaAnnotationHandlerInterface from "./SaAnnotationHandlerInterface.js";
import SaTokenException from "../../exception/SaTokenException.js";
import SaHttpDigestUtil from "../../httpauth/digest/SaHttpDigestUtil.js";
import SaFoxUtil from "../../util/SaFoxUtil.js";

/**
 * 注解 SaCheckHttpDigest 的处理器
 *
 * @author click33 qirly
 * @since 2025/8/10
 */
class SaCheckHttpDigestHandler extends SaAnnotationHandlerInterface {
    
    getHandlerAnnotationClass() {
        // 由于 JavaScript 中没有真正的注解类，我们返回一个标识符
        return SaCheckHttpDigest;
    }

    checkMethod(at, element) {
        SaCheckHttpDigestHandler._checkMethod(at.username, at.password, at.realm, at.value);
    }

    static _checkMethod(username, password, realm, value) {
        // 如果配置了 value，则以 value 优先
        if(SaFoxUtil.isNotEmpty(value)){
            const arr = value.split(":");
            if(arr.length != 2){
                throw new SaTokenException("注解参数配置错误，格式应如：username:password");
            }
            SaHttpDigestUtil.check(arr[0], arr[1]);
            return;
        }

        // 如果配置了 username，则分别获取参数
        if(SaFoxUtil.isNotEmpty(username)){
            SaHttpDigestUtil.check(username, password, realm);
            return;
        }

        // 都没有配置，则根据全局配置参数进行校验
        SaHttpDigestUtil.check();
    }

}

export default SaCheckHttpDigestHandler;