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

import SaFoxUtil from '../util/SaFoxUtil.js';
/**
 * 应用全局信息
 *
 * @author click33
 * @since 1.31.0
 */

class ApplicationInfo {
    /**
     * 应用前缀
     * @type {string}
     */
    static routePrefix = '';

    /**
     * 为指定 path 裁剪掉 routePrefix 前缀
     * @param {string} path 指定路径
     * @returns {string} 处理后的路径
     */
    static cutPathPrefix(path) {
        if (!SaFoxUtil.isEmpty(this.routePrefix) && 
            this.routePrefix !== "/" && 
            path.startsWith(this.routePrefix)) {
            path = path.substring(this.routePrefix.length);
        }
        return path;
    }
}

// 导出单例
export default ApplicationInfo;