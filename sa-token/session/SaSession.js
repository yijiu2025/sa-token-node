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

import SaManager from "../SaManager.js";
import SaSetValueInterface from "../application/SaSetValueInterface.js"
import SaTokenDao from "../dao/SaTokenDao.js";
import SaTwoParamFunction from "../fun/SaTwoParamFunction.js";
import SaTokenEventCenter from "../listener/SaTokenEventCenter.js";
import SaFoxUtil from "../util/SaFoxUtil.js";
import SaTerminalInfo from "./SaTerminalInfo.js"

/**
 * Session Model，会话作用域的读取值对象
 *
 * <p> 在一次会话范围内: 存值、取值。数据在注销登录后失效。</p>
 * <p>
 *    在 Sa-Token 中，SaSession 分为三种，分别是：	<br>
 *     	- Account-Session: 指的是框架为每个 账号id 分配的 SaSession。	<br>
 * 		- Token-Session: 指的是框架为每个 token 分配的 SaSession。	<br>
 * 		- Custom-Session: 指的是以一个 特定的值 作为SessionId，来分配的 SaSession。	<br>
 * 	  <br>
 * 	  注意：以上分类仅为框架设计层面的概念区分，实际上它们的数据存储格式都是一致的。
 * </p>
 *
 * @author click33
 * @since 1.10.0
 */
class SaSession extends SaSetValueInterface {

	/**
	 * 
	 */
	//private static final long serialVersionUID = 1L;

	/**
	 * 在 SaSession 上存储用户对象时建议使用的 key
	 */
	static USER = "USER";

	/**
	 * 在 SaSession 上存储角色列表时建议使用的 key
	 */
	static ROLE_LIST = "ROLE_LIST";

	/**
	 * 在 SaSession 上存储权限列表时建议使用的 key
	 */
	static PERMISSION_LIST = "PERMISSION_LIST";

	/**
	 * 此 {String} SaSession 的 id
	 */
	id;

	/**
	 * 此 {String} SaSession 的 类型
	 */
	type;

	/**
	 * 所属 {String} loginType
	 */
	loginType;

	/**
	 * 所属 {Object} loginId （当此 SaSession 属于 Account-Session 时，此值有效）
	 */
	loginId;

	/**
	 * 所属 {String} Token （当此 SaSession 属于 Token-Session 时，此值有效）
	 */
	token;

	/**
	 * 当前账号历史总计登录设备数量 {int} （当此 SaSession 属于 Account-Session 时，此值有效）
	 */
	historyTerminalCount;

	/**
	 * 此 SaSession {long} 的创建时间（13位时间戳）
	 */
	createTime;

	/**
	 * 所有挂载数据 {Map<Object, Object>}
	 */
	dataMap = new Map();;

	// ----------------------- 构建相关

	/**
	 * 构建一个 Session 对象
	 */
	// public SaSession() {
	// 	/*
	// 	 * 当 Session 从 Redis 中反序列化取出时，框架会误以为创建了新的Session，
	// 	 * 因此此处不可以调用this(null); 避免监听器收到错误的通知 
	// 	 */
	// 	// this(null);
	// }

	/**
	 * 构建一个 Session 对象
	 * @param id Session的id
	 */
	constructor() {
		this.id = id;
		this.createTime = Date.now();
 		// $$ 发布事件
		SaTokenEventCenter.doCreateSession(id);
	}
    

	/**
	 * 获取：此 SaSession 的 id
	 * @return {String} /
	 */
	getId() {
        return this.id;
    }

	/**
	 * 写入：此 SaSession 的 id
	 * @param {String} id /
	 * @return {SaSession} 对象自身
	 */
	setId(id) {
        this.id = id;
        return this;
    }

	/**
	 * 获取：此 SaSession 的 类型
	 *
	 * @return {String} /
	 */
	getType() {
        return this.type;
    }

	/**
	 * 设置：此 SaSession 的 类型
	 *
	 * @param {String} type /
	 * @return {SaSession} 对象自身
	 */
	setType(type) {
        this.type = type;
        return this;
    }

	/**
	 * 获取：所属 loginType
	 * @return {String} /
	 */
	getLoginType() {
        return this.loginType;
    }

	/**
	 * 设置：所属 loginType
	 * @param {String} loginType /
	 * @return {SaSession} 对象自身
	 */
	setLoginType(loginType) {
        this.loginType = loginType;
        return this;
    }

	/**
	 * 获取：所属 loginId （当此 SaSession 属于 Account-Session 时，此值有效）
	 * @return {Object} /
	 */
	getLoginId() {
        return this.loginId;
    }

	/**
	 * 设置：所属 loginId （当此 SaSession 属于 Account-Session 时，此值有效）
	 * @param {Object} loginId /
	 * @return {SaSession} 对象自身
	 */
	setLoginId(loginId) {
        this.loginId = loginId;
        return this;
    }

	/**
	 * 获取：所属 Token （当此 SaSession 属于 Token-Session 时，此值有效）
	 * @return {String} /
	 */
	getToken() {
        return this.token;
    }

	/**
	 * 设置：所属 Token （当此 SaSession 属于 Token-Session 时，此值有效）
	 * @param {String} token /
	 * @return {SaSession} 对象自身
	 */
	setToken(token) {
        this.token = token;
        return this;
    }

	/**
	 * 返回：当前 SaSession 的创建时间（13位时间戳）
	 * @return {long} /
	 */
	getCreateTime() {
        return this.createTime;
    }

	/**
	 * 写入：此 SaSession 的创建时间（13位时间戳）
	 * @param {long} createTime /
	 * @return {SaSession} 对象自身
	 */
	setCreateTime(createTime) {
        this.createTime = createTime;
        return this;
    }


	// ----------------------- SaTerminalInfo 相关

	/**
	 * 登录终端信息列表
	 */
	terminalList = [];;

	/**
	 * 写入登录终端信息列表
	 * @param {List<SaTerminalInfo>} terminalList /
	 */
	setTerminalList(terminalList) {
        this.terminalList = terminalList;
        //return this;
    }

	/**
	 * 获取登录终端信息列表
	 *
	 * @return {List<SaTerminalInfo>} /
	 */
	getTerminalList() {
        return this.terminalList;
    }

	/**
	 * 获取 登录终端信息列表 (拷贝副本)
	 *
	 * @return {List<SaTerminalInfo>} /
	 */
	terminalListCopy() {
        return [...this.terminalList];
    }

	/**
	 * 获取 登录终端信息列表 (拷贝副本)，根据 deviceType 筛选
	 *
	 * @param {String} deviceType /设备类型，填 null 代表不限设备类型
	 * @return {List<SaTerminalInfo>} /
	 */
	getTerminalListByDeviceType(deviceType) {
        if (deviceType == null) {
            return this.terminalListCopy();
        }
        return this.terminalListCopy().filter(t => 
            SaFoxUtil.equals(t.getDeviceType(), deviceType));
    }

	/**
	 * 获取 登录终端 token 列表
	 *
	 * @param {String} deviceType 设备类型，填 null 代表不限设备类型
	 * @return {List<String>} 此 loginId 的所有登录 token
	 */
	getTokenValueListByDeviceType(deviceType) {
        return this.getTerminalListByDeviceType(deviceType)
            .map(t => t.getTokenValue());
    }

	/**
	 * 查找一个终端信息，根据 tokenValue
	 *
	 * @param {String} tokenValue token值 /
	 * @return {SaTerminalInfo} /
	 */
    getTerminal(tokenValue) {
        return this.terminalListCopy().find(t => 
            SaFoxUtil.equals(t.getTokenValue(), tokenValue)) || null;
    }

	/**
	 * 添加一个终端信息
	 *
	 * @param {SaTerminalInfo} terminalInfo /
	 */
	addTerminal(terminalInfo) {
		// 根据 tokenValue 值查重，如果存在旧的，则先删除
		const old = this.getTerminal(terminalInfo.getTokenValue());
        if (old) {
            this.terminalList = this.terminalList.filter(t => t !== old);
        }
		// 然后添加新的
		this.historyTerminalCount++;
        terminalInfo.setIndex(this.historyTerminalCount);
        this.terminalList.push(terminalInfo);
        this.update();
	}

	/**
	 * 移除一个终端信息
	 *
	 * @param {String} tokenValue token值 /
	 */
	removeTerminal(tokenValue) {
        const terminal = this.getTerminal(tokenValue);
        if (terminal) {
            this.terminalList = this.terminalList.filter(t => t !== terminal);
            this.update();
        }
    }

	/**
	 * 获取 当前账号历史总计登录设备数量 （当此 SaSession 属于 Account-Session 时，此值有效）
	 *
	 * @return {int} /
	 */
	getHistoryTerminalCount() {
        return this.historyTerminalCount;
    }

	/**
	 * 设置 当前账号历史总计登录设备数量 （当此 SaSession 属于 Account-Session 时，此值有效）
	 *
	 * @param {int} historyTerminalCount /
	 */
	setHistoryTerminalCount(historyTerminalCount) {
        this.historyTerminalCount = historyTerminalCount;
        //return this;
    }

	/**
	 * 遍历 terminalList 列表，执行特定函数
	 *
	 * @param {SaTwoParamFunction} function 需要执行的函数
	 */

    forEachTerminalList(func) {
        this.terminalListCopy().forEach(t => func(this, t));
    }

	/**
	 * 判断指定设备 id 是否为可信任设备
	 * @param {String} deviceId /
	 * @return {boolean} /
	 */
	isTrustDeviceId(deviceId) {
        if (SaFoxUtil.isEmpty(deviceId)) {
            return false;
        }
        return this.terminalListCopy().some(t => 
            SaFoxUtil.equals(t.getDeviceId(), deviceId));
    }


	// ----------------------- 一些操作

	/**
	 * 更新Session（从持久库更新刷新一下）
	 */
	update() {
		SaManager.getSaTokenDao().updateSession(this);
	}

	/** 注销Session (从持久库删除) */
	logout() {
		SaManager.getSaTokenDao().deleteSession(this.id);
 		// $$ 发布事件 
		SaTokenEventCenter.doLogoutSession(id);
	}

	/** 当 Session 上的 SaTerminalInfo 数量为零时，注销会话 */
	logoutByTerminalCountToZero() {
        if (this.terminalList.length === 0) {
            this.logout();
        }
    }

	/**
	 * 获取此Session的剩余存活时间 (单位: 秒) 
	 * @return 此Session的剩余存活时间 (单位: 秒)
	 */
	timeout() {
        return SaManager.getSaTokenDao().getSessionTimeout(this.id);
    }
	
	/**
	 * 修改此Session的剩余存活时间
	 * @param timeout 过期时间 (单位: 秒) 
	 */
	updateTimeout(timeout) {
        SaManager.getSaTokenDao().updateSessionTimeout(this.id, timeout);
    }
	
	/**
	 * 修改此Session的最小剩余存活时间 (只有在 Session 的过期时间低于指定的 minTimeout 时才会进行修改)
	 * @param minTimeout 过期时间 (单位: 秒) 
	 */
	updateMinTimeout(minTimeout) {
        const min = this.trans(minTimeout);
        const curr = this.trans(this.timeout());
        if (curr < min) {
            this.updateTimeout(minTimeout);
        }
	}

	/**
	 * 修改此Session的最大剩余存活时间 (只有在 Session 的过期时间高于指定的 maxTimeout 时才会进行修改)
	 * @param maxTimeout 过期时间 (单位: 秒) 
	 */
	updateMaxTimeout(maxTimeout) {
        const max = this.trans(maxTimeout);
        const curr = this.trans(this.timeout());
        if (curr > max) {
            this.updateTimeout(maxTimeout);
        }
	}
	
	/**
	 * value为 -1 时返回 Long.MAX_VALUE，否则原样返回 
	 * @param value /
	 * @return /
	 */
	trans(value) {
		return value === SaTokenDao.NEVER_EXPIRE ? Number.MAX_SAFE_INTEGER : value;
	}


	// ----------------------- 存取值 (类型转换)

	// ---- 重写接口方法 
	
	/**
	 * 取值 
	 * @param {string} key key 
	 * @return {Object} 值 
	 */
	// @Override
	get(key) {
        return this.dataMap.get(key);
    }
	
	/**
	 * 写值 
	 * @param {string} key  名称
	 * @param {Object} value 值
	 * @return {SaSession} 对象自身
	 */
	// @Override
	set(key, value) {
        this.dataMap.set(key, value);
        this.update();
        return this;
    }

	/**
	 * 写值 (只有在此 key 原本无值的情况下才会写入)
	 * @param {string} key   名称
	 * @param {Object} value 值
	 * @return {SaSession} 对象自身
	 */
	// @Override
    setByNull(key, value) {
        if (!this.has(key)) {
            this.set(key, value);
            this.update();
        }
        return this;
    }


	/**
	 * 删值
	 * @param {string} key 要删除的key
	 * @return {SaSession} 对象自身
	 */
	// @Override
	delete(key) {
        this.dataMap.delete(key);
        this.update();
        return this;
    }


	// ----------------------- 其它方法

	/**
	 * 返回当前 Session 挂载数据的所有 key
	 *
	 * @return {Set<String>} key 列表
	 */
	keys() {
        return new Set(this.dataMap.keys());
		//return dataMap.keySet();
	}
	
	/**
	 * 清空所有挂载数据
	 */
	clear() {
        this.dataMap.clear();
        this.update();
    }

	/**
	 * 获取数据挂载集合（如果更新map里的值，请调用 session.update() 方法避免产生脏数据 ）
	 *
	 * @return {Map<String, Object>}返回底层储存值的map对象
	 */
	getDataMap() {
		return dataMap;
	}

	/**
	 * 设置数据挂载集合 (改变底层对象引用，将 dataMap 整个对象替换)
	 * @param {Map<String, Object>} dataMap /数据集合
	 *
	 * @return {SaSession} 对象自身
	 */
	setDataMap(dataMap) {
		this.dataMap = dataMap;
		return this;
	}

	/**
	 * 写入数据集合 (不改变底层对象引用，只将此 dataMap 所有数据进行替换)
	 * @param {Map<String, Object>} dataMap /数据集合
     * @return {SaSession} 对象自身 
	 */
	refreshDataMap(dataMap) {
		this.dataMap.clear();
        new Map(dataMap).forEach((v, k) => this.dataMap.set(k, v));
		//this.dataMap.putAll(dataMap);
		this.update();
		return this;
	}

	//

}
export default SaSession;
