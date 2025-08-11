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

import SaManager from "../../SaManager.js";
import SaCheckLogin from "../SaCheckLogin.js";
import StpLogic from "../../stp/StpLogic.js";
import SaAnnotationHandlerInterface from "./SaAnnotationHandlerInterface.js";

/**
 * 注解 SaCheckLogin 的处理器
 *
 * @author click33 qirly
 * @since 2025/8/11
 */
class SaCheckLoginHandler extends SaAnnotationHandlerInterface {

    getHandlerAnnotationClass() {
        return SaCheckLogin;
    }

    checkMethod(at, element) {
        SaCheckLoginHandler._checkMethod(at.type);
    }

    static _checkMethod(type) {
        const stpLogic = SaManager.getStpLogic(type, false);

        stpLogic.checkLogin();
    }

}
export default SaCheckLoginHandler;