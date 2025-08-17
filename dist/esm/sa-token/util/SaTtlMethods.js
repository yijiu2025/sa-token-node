import SaTokenDao from '../dao/SaTokenDao.js';

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
 * TTL 操作工具方法
 *
 * @author click33 qirly
 * @since 1.43.0
 */
class SaTtlMethods {

	/**
	 * 获取一个新的 Token 集合
	 * @return {List<String>} /
	 */
	newTokenValueList() {
		return [];
	}

	/**
	 * 获取一个新的 TokenIndexMap 集合
	 * @return {Map<String, Long>} /
	 */
	newTokenIndexMap() {
		return new Map();
	}

	/**
	 * 获取最大 ttl 值
	 * @param {ArrayList<Long>} ttlList /
	 * @return {long} /
	 */
	getMaxTtl(ttlList) {
		let maxTtl = 0;
		for (const ttl of ttlList) {
			if(ttl === SaTokenDao.NEVER_EXPIRE) {
				maxTtl = SaTokenDao.NEVER_EXPIRE;
				break;
			}
			if(ttl > maxTtl) {
				maxTtl = ttl;
			}
		}
		return maxTtl;
	}

	/**
	 * 获取最大 ttl 值：过期时间 (13位时间戳) 转 ttl (秒)
	 * @param {Collection<Long>} expireTimeList /
	 * @return {long} /
	 */
	getMaxTtlByExpireTime(expireTimeList) {
		let maxTtl = 0;
		for (const expireTime of expireTimeList) {
			const ttl = this.expireTimeToTtl(expireTime);
			if(ttl === SaTokenDao.NEVER_EXPIRE) {
				maxTtl = SaTokenDao.NEVER_EXPIRE;
				break;
			}
			if(ttl > maxTtl) {
				maxTtl = ttl;
			}
		}
		return maxTtl;
	}

	/**
	 * 过期时间 (13位时间戳) 转 (13位时间戳) ttl (秒)
	 * @param {long} expireTime /
	 * @return {long} /
	 */
	expireTimeToTtl(expireTime) {
		if(expireTime === SaTokenDao.NEVER_EXPIRE) {
			return SaTokenDao.NEVER_EXPIRE;
		}
		if(expireTime === SaTokenDao.NOT_VALUE_EXPIRE) {
			return SaTokenDao.NOT_VALUE_EXPIRE;
		}
		const currentTime = Date.now();
		if(expireTime < currentTime) {
			return SaTokenDao.NOT_VALUE_EXPIRE;
		}
		return (expireTime - currentTime) / 1000;
	}

	/**
	 * ttl (秒) 转 过期时间 (13位时间戳)
	 * @param {long} ttl /
	 * @return {long} /
	 */
	ttlToExpireTime(ttl) {
		if(ttl === SaTokenDao.NEVER_EXPIRE) {
			return SaTokenDao.NEVER_EXPIRE;
		}
		if(ttl < 0) {
			return SaTokenDao.NOT_VALUE_EXPIRE;
		}
		return ttl * 1000 + Date.now();
	}

}

export { SaTtlMethods as default };
