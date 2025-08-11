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
import SaCheckPermission from "../SaCheckPermission.js";
import SaMode from "../SaMode.js";
import NotPermissionException from "../../exception/NotPermissionException.js";
import StpLogic from "../../stp/StpLogic.js";
import SaFoxUtil from "../../util/SaFoxUtil.js";
import SaAnnotationHandlerInterface from "./SaAnnotationHandlerInterface.js";


/**
 * 注解 SaCheckPermission 的处理器
 *
 * @author click33 qirly
 * @since 2025/8/11
 */
class SaCheckPermissionHandler extends SaAnnotationHandlerInterface {

    getHandlerAnnotationClass() {
        return SaCheckPermission;
    }

    checkMethod(at, element) {
        SaCheckPermissionHandler._checkMethod(at.type, at.value, at.mode, at.orRole);
    }

    static _checkMethod(type, value, mode, orRole) {
        const stpLogic = SaManager.getStpLogic(type, false);

        const permissionArray = value;
        try {
            if(mode == SaMode.AND) {
                stpLogic.checkPermissionAnd(permissionArray);
            } else {
                stpLogic.checkPermissionOr(permissionArray);
            }
        } catch (e) {
            if (e instanceof NotPermissionException) {
                // 权限认证校验未通过，再开始角色认证校验
                for (const role of orRole) {
                    const rArr = SaFoxUtil.convertStringToArray(role);
                    // 某一项 role 认证通过，则可以提前退出了，代表通过
                    if (stpLogic.hasRoleAnd(...rArr)) {
                        return;
                    }
                }
                throw e;
            } else {
                throw e;
            }
        }
    }

}
export default SaCheckPermissionHandler;