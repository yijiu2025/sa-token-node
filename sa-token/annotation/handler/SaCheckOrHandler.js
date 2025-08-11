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
import SaTokenException from "../../exception/SaTokenException.js";
import SaAnnotationStrategy from "../../strategy/SaAnnotationStrategy.js";

// import cn.dev33.satoken.annotation.*;


/**
 * 注解 SaCheckOr 的处理器
 *
 * @author click33 qirly
 * @since 2025/8/11
 */
class SaCheckOrHandler extends SaAnnotationHandlerInterface {

    getHandlerAnnotationClass() {
        return SaCheckOr;
    }

    checkMethod(at, element) {
        SaCheckOrHandler._checkMethod(at.login, at.role, at.permission, at.safe, at.httpBasic, at.httpDigest, at.disable, at.append, element);
    }

    static _checkMethod(
            login,
            role,
            permission,
            safe,
            httpBasic,
            httpDigest,
            disable,
            append,
            element
    ) {
        // 先把所有注解塞到一个 list 里
        const annotationList = [];
        annotationList.push(...login);
        annotationList.push(...role);
        annotationList.push(...permission);
        annotationList.push(...safe);
        annotationList.push(...disable);
        annotationList.push(...httpBasic);
        annotationList.push(...httpDigest);
        for (const annotationClass of append) {
            const annotation = SaAnnotationStrategy.instance.getAnnotation.apply(element, annotationClass);
            if (annotation != null) {
                annotationList.push(annotation);
            }
        }

        // 如果 atList 为空，说明 SaCheckOr 上不包含任何注解校验，我们直接跳过即可
        if (annotationList.length === 0) {
            return;
        }

        // 逐个开始校验 >>>
        const errorList = [];
        for (let item of annotationList) {
            try {
                SaAnnotationStrategy.instance.annotationHandlerMap.get(item.annotationType()).check(item, element);
                // 只要有一个校验通过，就可以直接返回了
                return;
            } catch (e) {
                if (e instanceof SaTokenException) {
                    errorList.push(e);
                } else {
                    throw e;
                }
            }
        }

        // 执行至此，说明所有注解校验都通过不了，此时 errorList 里面会有多个异常，我们随便抛出一个即可
        throw errorList[0];
    }

}

export default SaCheckOrHandler;