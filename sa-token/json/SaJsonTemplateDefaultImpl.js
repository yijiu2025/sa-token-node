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

import SaErrorCode from '../error/SaErrorCode.js';
import NotImplException from '../exception/NotImplException.js';
import SaJsonTemplate from './SaJsonTemplate.js';

/**
 * JSON 转换器，默认实现类
 *
 * <p> 如果代码断点走到了此默认实现类，说明框架没有注入有效的 JSON 转换器，需要开发者自行实现并注入 </p>
 *
 * @author click33
 * @since 1.30.0
 */


class SaJsonTemplateDefaultImpl extends SaJsonTemplate {

	static ERROR_MESSAGE = "未实现具体的 json 转换器";

	// @Override
	objectToJson(obj) {
		throw new NotImplException(ERROR_MESSAGE).setCode(SaErrorCode.CODE_10003);
	}

	// @Override
	// jsonToObject(jsonStr) {
	// 	throw new NotImplException(ERROR_MESSAGE).setCode(SaErrorCode.CODE_10003);
	// }

	// @Override
	static jsonToObject(jsonStr, type) {
		throw new NotImplException(ERROR_MESSAGE).setCode(SaErrorCode.CODE_10003);
	}

	// @Override
	jsonToMap(jsonStr) {
		throw new NotImplException(ERROR_MESSAGE).setCode(SaErrorCode.CODE_10003);
	}
	
}

export default SaJsonTemplateDefaultImpl;
