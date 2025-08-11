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

import SaHttpDigestModel from "../httpauth/digest/SaHttpDigestModel.js";


/**
 * Http Digest 认证校验：只有通过 Http Digest 认证后才能进入该方法，否则抛出异常。
 *
 * <p> 可标注在方法、类上（效果等同于标注在此类的所有方法上）
 *
 * @author click33 qirly
 * @since 1.38.0
 */
// @Retention(RetentionPolicy.RUNTIME)
// @Target({ ElementType.METHOD, ElementType.TYPE })
class SaCheckHttpDigest {

    /**
     * 用户名
     * @return {String} /
     */
    username = "";

    /**
     * 密码
     * @return {String} /
     */
    password = "";

    /**
     * 领域
     * @return {String} /
     */
    realm = SaHttpDigestModel.DEFAULT_REALM;

    /**
     * 需要校验的用户名和密码，格式形如 sa:123456
     * @return {String} /
     */
    value = "";

}

export default SaCheckHttpDigest;
