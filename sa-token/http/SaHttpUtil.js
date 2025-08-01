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

import SaManager from '../SaManager.js';

/**
 * Http 请求处理器 工具类
 * 
 * @author click33
 * @since 1.43.0
 */

class SaHttpUtil {

	/**
	 * get 请求
	 *
	 * @param url /
	 * @return /
	 */
	get(url) {
		return SaManager.getSaHttpTemplate().get(url);
	}

	/**
	 * post 请求，form-data 格式参数
	 *
	 * @param url /
	 * @param params /
	 * @return /
	 */
	postByFormData(url, params) {
		return SaManager.getSaHttpTemplate().postByFormData(url, params);
	}

}

// 冻结静态属性
// Object.freeze(SaHttpUtil);
// Object.freeze(SaHttpUtil.prototype);

export default SaHttpUtil;





