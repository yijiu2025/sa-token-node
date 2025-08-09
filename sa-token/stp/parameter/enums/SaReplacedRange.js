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

/**
 * 顶人下线的范围
 *
 * @author click33
 * @since 1.41.0
 */
const SaReplacedRange = {
    /**
     * 当前指定的设备类型端
     */
    CURR_DEVICE_TYPE: "CURR_DEVICE_TYPE",
    
    /**
     * 所有设备类型端
     */
    ALL_DEVICE_TYPE: "ALL_DEVICE_TYPE"
};

// 冻结对象以防止修改
Object.freeze(SaReplacedRange);

// 使用 ES6 模块语法导出
export default SaReplacedRange;