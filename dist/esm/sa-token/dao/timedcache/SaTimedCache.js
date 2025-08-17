import SaManager from '../../SaManager.js';
import SaTokenDao from '../SaTokenDao.js';

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
 * 一个定时缓存的简单实现，采用：惰性检查 + 异步循环扫描
 *
 * @author click33 qirly
 * @since 1.41.0
 */

/**
 * 定时缓存实现（惰性检查 + 异步循环扫描）
 */
class SaTimedCache {
    /**
     * 存储数据的集合 {SaMapPackage<Object>}
     */
    dataMap;

    /**
     * 存储过期时间的集合（单位: 毫秒）, 记录所有 key 的到期时间 （注意存储的是到期时间，不是剩余存活时间）
     */
    expireMap;

    /**
     * 刷新线程引用
     */
    refreshTimer = null;

    /**
     * 是否继续执行数据清理的线程标记
     */
    refreshFlag = false;

    constructor(dataMap, expireMap) {
        this.dataMap = dataMap;
        this.expireMap = expireMap;
    }

    // ------------------------ 基础 API 读写操作 ------------------------

    getObject(key) {
        this.clearKeyByTimeout(key);
        return this.dataMap.get(key);
    }

    setObject(key, object, timeout) {
        if (timeout === 0 || timeout <= SaTokenDao.NOT_VALUE_EXPIRE) {
            return;
        }
        this.dataMap.put(key, object);
        this.expireMap.put(
            key,
            timeout === SaTokenDao.NEVER_EXPIRE 
                ? SaTokenDao.NEVER_EXPIRE 
                : Date.now() + timeout * 1000
        );
    }

    updateObject(key, object) {
        if (this.getKeyTimeout(key) === SaTokenDao.NOT_VALUE_EXPIRE) {
            return;
        }
        this.dataMap.put(key, object);
    }

    deleteObject(key) {
        this.dataMap.remove(key);
        this.expireMap.remove(key);
    }

    getObjectTimeout(key) {
        return this.getKeyTimeout(key);
    }

    updateObjectTimeout(key, timeout) {
        this.expireMap.put(
            key,
            timeout === SaTokenDao.NEVER_EXPIRE 
                ? SaTokenDao.NEVER_EXPIRE 
                : Date.now() + timeout * 1000
        );
    }

    keySet() {
        return this.dataMap.keySet();
    }

    // ------------------------ 过期时间相关操作 ------------------------

    /**
     * 如果指定的 key 已经过期，则立即清除它
     * @param key 指定 key
     */
    clearKeyByTimeout(key) {
        const expirationTime = this.expireMap.get(key);
        // 清除条件：
        // 		1、数据存在。
        // 		2、不是 [ 永不过期 ]。
        // 		3、已经超过过期时间。
        if (expirationTime != null && 
            expirationTime !== SaTokenDao.NEVER_EXPIRE && 
            expirationTime < Date.now()) {
            this.dataMap.remove(key);
            this.expireMap.remove(key);
        }
    }


    /**
     * 获取指定 key 的剩余存活时间 （单位：秒）
     * @param key 指定 key
     * @return 这个 key 的剩余存活时间
     */
    getKeyTimeout(key) {
        // 由于数据过期检测属于惰性扫描，很可能此时这个 key 已经是过期状态了，所以这里需要先检查一下
        this.clearKeyByTimeout(key);

        // 获取这个 key 的过期时间
        const expire = this.expireMap.get(key);

        // 如果 expire 数据不存在，说明框架没有存储这个 key，此时返回 NOT_VALUE_EXPIRE
        if (expire == null) {
            return SaTokenDao.NOT_VALUE_EXPIRE;
        }

        // 如果 expire 被标注为永不过期，则返回 NEVER_EXPIRE
        if (expire === SaTokenDao.NEVER_EXPIRE) {
            return SaTokenDao.NEVER_EXPIRE;
        }

        // ---- 代码至此，说明这个 key 是有过期时间的，且未过期，那么：

        // 计算剩余时间并返回 （过期时间戳 - 当前时间戳） / 1000 转秒
        const timeout = (expire - Date.now()) / 1000;
        if (timeout < 0) {
            this.dataMap.remove(key);
            this.expireMap.remove(key);
            return SaTokenDao.NOT_VALUE_EXPIRE;
        }
        return timeout;
    }

    // ------------------------ 定时清理过期数据 ------------------------

    /**
     * 清理所有已经过期的 key
     */
    refreshDataMap() {
        for (const key of this.expireMap.keySet()) {
            this.clearKeyByTimeout(key);
        }
    }

    /**
     * 初始化定时任务，定时清理过期数据
     */
    async initRefreshThread() {
        // 如果开发者配置了 <=0 的值，则不启动定时清理 // 休眠N秒 
        const config = await SaManager.getConfig();
        const refreshPeriod = config.getDataRefreshPeriod();
        if (refreshPeriod <= 0) {
            return;
        }

        // 启动定时刷新
        this.refreshFlag = true;
        const refreshTask = () => {
            if (!this.refreshFlag) return;
            // 执行清理
            try {
                this.refreshDataMap();
            } catch (e) {
                console.error('定时清理出错:', e);
            }

            refreshPeriod = SaManager.getConfig().getDataRefreshPeriod();
            if(refreshPeriod <= 0) {
				refreshPeriod = 1;
            }
            
            setTimeout(refreshTask, refreshPeriod * 1000);
        };

        this.refreshTimer = setTimeout(refreshTask, refreshPeriod * 1000);
    }

    endRefreshThread() {
        this.refreshFlag = false;
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
    }
}

export { SaTimedCache as default };
