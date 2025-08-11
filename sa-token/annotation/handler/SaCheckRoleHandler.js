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
import SaCheckRole from "../SaCheckRole.js";
import SaMode from "../SaMode.js";
import StpLogic from "../../stp/StpLogic.js";
import SaAnnotationHandlerInterface from "./SaAnnotationHandlerInterface.js";

/**
 * 注解 SaCheckRole 的处理器
 *
 * @author click33 qirly
 * @since 2025/8/11
 */
class SaCheckRoleHandler extends SaAnnotationHandlerInterface {

    getHandlerAnnotationClass() {
        return SaCheckRole;
    }

    checkMethod(at, element) {
        SaCheckRoleHandler._checkMethod(at.type, at.value, at.mode);
    }

    static _checkMethod(type, value, mode) {
        const stpLogic = SaManager.getStpLogic(type, false);

        const roleArray = value;
        if(mode == SaMode.AND) {
            stpLogic.checkRoleAnd(roleArray);
        } else {
            stpLogic.checkRoleOr(roleArray);
        }
    }

}
export default SaCheckRoleHandler;