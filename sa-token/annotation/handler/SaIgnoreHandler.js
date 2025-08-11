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

import SaIgnore from "../SaIgnore.js";
import SaRouter from "../../router/SaRouter.js";
import SaAnnotationHandlerInterface from "./SaAnnotationHandlerInterface.js";

/**
 * 注解 SaIgnore 的处理器
 * <h2> v1.43.0 版本起，SaIgnore 注解处理逻辑已转移到全局策略中，此处理器代码仅做留档 </h2>
 *
 * @author click33 qirly
 * @since 2025/8/11
 */
class SaIgnoreHandler extends SaAnnotationHandlerInterface {

    getHandlerAnnotationClass() {
        return SaIgnore;
    }

    checkMethod(at, element) {
        SaIgnoreHandler._checkMethod();
    }

    static _checkMethod() {
        SaRouter.stop();
    }

}
export default SaIgnoreHandler;