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

import SaAnnotationHandlerInterface from "./SaAnnotationHandlerInterface.js";
import SaHttpBasicUtil from "../../httpauth/basic/SaHttpBasicUtil.js";
import SaCheckHttpBasic from "../SaCheckHttpBasic.js";


/**
 * 注解 SaCheckHttpBasic 的处理器
 *
 * @author click33 qirly
 * @since 2025/8/10
 */
class SaCheckHttpBasicHandler extends SaAnnotationHandlerInterface {

    getHandlerAnnotationClass() {
        // 由于 JavaScript 中没有真正的注解类，我们返回一个标识符
        return SaCheckHttpBasic;
    }


    checkMethod(at, element) {
        SaCheckHttpBasicHandler._checkMethod(at.realm, at.account);
    }

    static _checkMethod(realm, account) {
        SaHttpBasicUtil.check(realm, account);
    }

}
export default SaCheckHttpBasicHandler;