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

import SaManager from '../../SaManager.js';

import SaCheckHttpDigest from '../../annotation/SaCheckHttpDigest.js';
import SaHolder from '../../context/SaHolder.js';
import SaErrorCode from '../../error/SaErrorCode.js';
import NotHttpDigestAuthException from '../../exception/NotHttpDigestAuthException.js';
import SaTokenException from '../../exception/SaTokenException.js';
import SaSecureUtil from '../../secure/SaSecureUtil.js';
import SaFoxUtil from '../../util/SaFoxUtil.js';
import SaHttpDigestModel from './SaHttpDigestModel.js';
/**
 * Sa-Token Http Digest 认证模块 - 模板方法类
 *
 * @author click33 qirly
 * @since 1.38.0
 */

class SaHttpDigestTemplate {

    /*
        这里只是 Http Digest 认证的一个简单实现，待实现功能还有：
            1、nonce 防重放攻击
            2、nc 计数器
            3、qop 保护质量=auth-int
            4、opaque 透明值
            5、algorithm 更多摘要算法
            等等
     */

    /**
     * 构建认证失败的响应头参数
     * @param {SaHttpDigestModel } model 参数对象
     * @return 响应头值
     */
    buildResponseHeaderValue(model) {
        // 抛异常
        return `Digest realm="${model.realm}", qop="${model.qop}", nonce="${model.nonce}", nc=${model.nc}, opaque="${model.opaque}"`;
    }

    /**
     * 在校验失败时，设置响应头，并抛出异常
     * @param {SaHttpDigestModel} model  Digest 参数对象
     */
    throwNotHttpDigestAuthException(model) {
        // 补全一些必须的参数
        model.realm = (model.realm != null) ? model.realm : SaHttpDigestModel.DEFAULT_REALM;
        model.qop = (model.qop != null) ? model.qop : SaHttpDigestModel.DEFAULT_QOP;
        model.nonce = (model.nonce != null) ? model.nonce : SaFoxUtil.getRandomString(32);
        model.opaque = (model.opaque != null) ? model.opaque : SaFoxUtil.getRandomString(32);
        model.nc = (model.nc != null) ? model.nc : "00000001";

        // 设置响应头
        SaHolder.getResponse()
                .setStatus(401)
                .setHeader("WWW-Authenticate", this.buildResponseHeaderValue(model));

        // 抛异常
        throw new NotHttpDigestAuthException().setCode(SaErrorCode.CODE_10312);
    }

    /**
     * 获取浏览器提交的 Digest 参数 （裁剪掉前缀）
     * @return 值
     */
    getAuthorizationValue() {

        // 获取前端提交的请求头 Authorization 参数
        const authorization = SaHolder.getRequest().getHeader("Authorization");

        // 如果不是以 Digest 作为前缀，则视为无效
        if(!authorization || !authorization.startsWith("Digest ")) {
            return null;
        }

        // 裁剪前缀并解码
        return authorization.substring(7);
    }

    /**
     * 获取浏览器提交的 Digest 参数，并转化为 Map
     * @return {SaHttpDigestModel}/
     */
    getAuthorizationValueToModel() {

        // 先获取字符串值
        const authorization = this.getAuthorizationValue();
        if(authorization == null) {
//            throw new SaTokenException("请求头中未携带 Digest 认证参数");
            return null;
        }

        // 根据逗号分割，解析为 Map
        const map = new Map();
        const arr = authorization.split(",");
        for (const s of arr) {
            const kv = s.split("=");
            if (kv.length === 2) {
                map.set(kv[0].trim(), kv[1].trim().replace(/"/g, ''));
            }
            // 兼容字符串包含多个=的情况，如：uri 带参数的问题
            // username="sa", realm="Sa-Token", nonce="IWlEwO23oCAbIAbHX1BYnX5ddKHUdsjW", uri="/test/testDigest?name=zhangsan&age=18", response="c4359210ccb23c985234ee6e02def88d", opaque="H6jPyjwfioc0oUbDE0OSmpX7wznfxxMo", qop=auth, nc=00000002, cnonce="46dd0073c981a9c7"
            else if (s.includes("=")) {
				map.set(kv[0].trim(), s.substring(kv[0].length() + 1).trim().replace(/"/g, ""));
			}
        }

        /*
            参考样例：
                username=sa,
                realm=Sa-Token,
                nonce=dcd98b7102dd2f0e8b11d0f600bfb0c093,
                uri=/test/testDigest,
                response=a32023c128e142163dd4856a2f511c70,
                opaque=5ccc069c403ebaf9f0171e9517f40e41,
                qop=auth,
                nc=00000002,
                cnonce=f3ca6bfc0b2f59c4
         */

        // 转化为 Model
        const model = new SaHttpDigestModel();
        model.username = map.get("username");
        model.realm = map.get("realm");
        model.nonce = map.get("nonce");
        model.uri = map.get("uri");
        model.method = SaHolder.getRequest().getMethod();
        model.qop = map.get("qop");
        model.nc = map.get("nc");
        model.cnonce = map.get("cnonce");
        model.opaque = map.get("opaque");
        model.response = map.get("response");

        //
        return model;
    }

    /**
     * 计算：根据 Digest 参数计算 response
     *
     * @param {SaHttpDigestModel} model Digest 参数对象
     * @return {String} 计算出的 response
     */
    calcResponse(model) {

        // frag1 = md5(username:realm:password)
        const frag1 = SaSecureUtil.md5(`${model.username}:${model.realm}:${model.password}`);

        // frag2 = nonce:nc:cnonce:qop
        const frag2 = `${model.nonce}:${model.nc}:${model.cnonce}:${model.qop}`;

        // frag3 = md5(method:uri)
        const frag3 = SaSecureUtil.md5(`${model.method}:${model.uri}`);

        // 最终结果 = md5(frag1:frag2:frag3)
        const response = SaSecureUtil.md5(`${frag1}:${frag2}:${frag3}`);

        //
        return response;
    }

    /**
     * 把 hopeModel 有的值都 copy 到 reqModel 中
     */
    copyHopeToReq(hopeModel,reqModel){
        reqModel.username = hopeModel.username;
        reqModel.password = hopeModel.password;
        reqModel.realm = hopeModel.realm != null ? hopeModel.realm : reqModel.realm;
        reqModel.nonce = hopeModel.nonce != null ? hopeModel.nonce : reqModel.nonce;
        reqModel.uri = hopeModel.uri != null ? hopeModel.uri : reqModel.uri;
        reqModel.method = hopeModel.method != null ? hopeModel.method : reqModel.method;
        reqModel.qop = hopeModel.qop != null ? hopeModel.qop : reqModel.qop;
        reqModel.nc = hopeModel.nc != null ? hopeModel.nc : reqModel.nc;
        reqModel.opaque = hopeModel.opaque != null ? hopeModel.opaque : reqModel.opaque;
        // reqModel.cnonce = hopeModel.cnonce != null ? hopeModel.cnonce : reqModel.cnonce;
        // reqModel.response = hopeModel.response != null ? hopeModel.response : reqModel.response;
    }

    // ---------- 校验 ----------

    check(arg1, arg2, arg3) {
        
        /**
         * 校验：根据全局配置参数，校验不通过抛出异常
         */
        if (arguments.length === 0) {
            const httpDigest = SaManager.getConfig().getHttpDigest();
            if(SaFoxUtil.isEmpty(httpDigest)){
                throw new SaTokenException("未配置全局 Http Digest 认证参数");
            }
            const arr = httpDigest.split(":");
            if(arr.length != 2){
                throw new SaTokenException("全局 Http Digest 认证参数配置错误，格式应如：username:password");
            }
            return this.check(arr[0], arr[1]);
        } else if (arguments.length === 1){
            /**
             * 校验：根据提供 Digest 参数计算 res，与 request 请求中的 Digest 参数进行校验，校验不通过则抛出异常
             * @param arg1 hopeModel 提供的 Digest 参数对象
             */

            // 先进行一些必须的希望参数校验
            SaTokenException.notEmpty(arg1, "Digest参数对象不能为空");
            SaTokenException.notEmpty(arg1.username, "必须提供希望的 username 参数");
            SaTokenException.notEmpty(arg1.password, "必须提供希望的 password 参数");

            // 获取 web 请求中的 Digest 参数
            const reqModel = this.getAuthorizationValueToModel();

            // 为空代表前端根本没有提交 Digest 参数，直接抛异常
            if(reqModel == null) {
                this.throwNotHttpDigestAuthException(arg1);
            }

            // 把 hopeModel 有的值都 copy 到 reqModel 中
            this.copyHopeToReq(arg1, reqModel);

            // 计算
            const cResponse = this.calcResponse(reqModel);

            // 比对，不一致就抛异常
            if(String(cResponse) !== String(reqModel.response)) {
                this.throwNotHttpDigestAuthException(arg1);
            }

            // 认证通过
        } else if(arguments.length === 2) {
            /**
             * 校验：根据提供的参数，校验不通过抛出异常
             * @param arg1 username 用户名
             * @param arg2 password 密码
             */
            this.check(new SaHttpDigestModel(arg1, arg2));
        } else if(arguments.length === 3) {
            /**
             * 校验：根据提供的参数，校验不通过抛出异常
             * @param arg1 username 用户名
             * @param arg2 password 密码
             * @param arg3 realm 领域
             */
            this.check(new SaHttpDigestModel(arg1, arg2, arg3));
        }
    }



    // ----------------- 过期方法 -----------------

    /**
     * 根据注解 ( @SaCheckHttpDigest ) 鉴权
     *
     * @param at 注解对象
     */
    @Deprecated
    checkByAnnotation(at) {

        // 如果配置了 value，则以 value 优先
        const value = at.value();
        if(SaFoxUtil.isNotEmpty(value)){
            const arr = value.split(":");
            if(arr.length != 2){
                throw new SaTokenException("注解参数配置错误，格式应如：username:password");
            }
            this.check(arr[0], arr[1]);
            return;
        }

        // 如果配置了 username，则分别获取参数
        const username = at.username();
        if(SaFoxUtil.isNotEmpty(username)){
            this.check(username, at.password(), at.realm());
            return;
        }

        // 都没有配置，则根据全局配置参数进行校验
        this.check();
    }

}

export default SaHttpDigestTemplate;

