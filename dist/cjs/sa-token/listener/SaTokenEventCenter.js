'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var SaTokenException = require('../exception/SaTokenException.js');
var SaErrorCode = require('../error/SaErrorCode.js');
require('dayjs');
require('dayjs/plugin/utc.js');
require('dayjs/plugin/timezone.js');
require('lodash');
require('../stp/parameter/enums/SaReplacedRange.js');
require('../stp/parameter/enums/SaLogoutMode.js');
require('../stp/parameter/enums/SaLogoutRange.js');
require('../SaManager.js');
require('../dao/SaTokenDao.js');
var SaTokenListenerForLog = require('./SaTokenListenerForLog.js');

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
 * Sa-Token 事件中心 事件发布器
 *
 * <p> 提供侦听器注册、事件发布能力 </p>
 * 
 * @author click33
 * @since 1.31.0
 */


class SaTokenEventCenter {

	// --------- 注册侦听器 
	

    static listenerList = [new SaTokenListenerForLog()];
	// private static List<SaTokenListener> listenerList = new ArrayList<>();
	
	// static {
	// 	// 默认添加控制台日志侦听器 
	// 	listenerList.add(new SaTokenListenerForLog());
	// }

	/**
	 * 获取已注册的所有侦听器
	 * @return  {SaTokenListener}/ 
	 */
	static getListenerList() {
		return this.listenerList.slice(); // 返回副本以避免外部修改
	}

	/**
	 * 重置侦听器集合
	 * @param {List<SaTokenListener>} listenerList / 
	 */
	static setListenerList(listenerList) {
		if(listenerList == null) {
			throw new SaTokenException("重置的侦听器集合不可以为空").setCode(SaErrorCode.CODE_10031);
		}
		this.listenerList = listenerList.slice();
	}

	/**
	 * 注册一个侦听器 
	 * @param {SaTokenListener} listener / 
	 */
	static registerListener(listener) {
		if(listener == null) {
			throw new SaTokenException("注册的侦听器不可以为空").setCode(SaErrorCode.CODE_10032);
		}
		this.listenerList.push(listener);
	}

	/**
	 * 注册一组侦听器 
	 * @param {List<SaTokenListener>} listenerList / 
	 */
	static registerListenerList(listenerList) {
		if(listenerList == null) {
			throw new SaTokenException("注册的侦听器集合不可以为空").setCode(SaErrorCode.CODE_10031);
		}
		for (const listener of listenerList) {
			if(listener == null) {
				throw new SaTokenException("注册的侦听器不可以为空").setCode(SaErrorCode.CODE_10032);
			}
		}
		this.listenerList.push(...listenerList);
	}

	/**
	 * 移除一个侦听器 
	 * @param {SaTokenListener} listener / 
	 */
    static removeListener(listener) {
        const index = this.listenerList.indexOf(listener);
        if (index !== -1) {
            this.listenerList.splice(index, 1);
        }
    }
	// static removeListener(listener) {
	// 	listenerList.remove(listener);
	// }

	/**
	 * 移除指定类型的所有侦听器 
	 * @param cls / 
	 */
    static removeListener(cls) {
        this.listenerList = this.listenerList.filter(
            listener => !(listener instanceof cls)
        );
    }

	// public static void removeListener(Class<? extends SaTokenListener> cls) {
	// 	ArrayList<SaTokenListener> listenerListCopy = new ArrayList<>(listenerList);
	// 	for (SaTokenListener listener : listenerListCopy) {
	// 		if(cls.isAssignableFrom(listener.getClass())) {
	// 			listenerList.remove(listener);
	// 		}
	// 	}
	// }

	/**
	 * 清空所有已注册的侦听器 
	 */
	static clearListener() {
		this.listenerList = [];
	}

	/**
	 * 判断是否已经注册了指定侦听器 
	 * @param listener / 
	 * @return / 
	//  */
	// static boolean hasListener(SaTokenListener listener) {
	// 	return listenerList.contains(listener);
	// }

	// /**
	//  * 判断是否已经注册了指定类型的侦听器 
	//  * @param cls / 
	//  * @return / 
	//  */
	// public static boolean hasListener(Class<? extends SaTokenListener> cls) {
	// 	for (SaTokenListener listener : listenerList) {
	// 		if(cls.isAssignableFrom(listener.getClass())) {
	// 			return true;
	// 		}
	// 	}
	// 	return false;
	// }
	/**
     * 判断是否已经注册了指定侦听器或类型
     * @param {SaTokenListener|Function} listenerOrClass 侦听器实例或类
     * @return {boolean} 是否已注册
     */
    static hasListener(listenerOrClass) {
        if (typeof listenerOrClass === 'function') {
            // 参数是类/构造函数
            return this.listenerList.some(listener => listener instanceof listenerOrClass);
        } else {
            // 参数是侦听器实例
            return this.listenerList.includes(listenerOrClass);
        }
    }
	
	// --------- 事件发布 
	
	/**
	 * 事件发布：xx 账号登录
	 * @param {string} loginType 账号类别
     * @param {Object} loginId 账号id
     * @param {string} tokenValue 本次登录产生的 token 值 
     * @param {SaLoginParameter} loginParameter 登录参数
	 */
	static  doLogin(loginType, loginId, tokenValue, loginParameter) {
        this.listenerList.forEach(listener => {
            listener.doLogin(loginType, loginId, tokenValue, loginParameter);
        });
		// for (SaTokenListener listener : listenerList) {
		// 	listener.doLogin(loginType, loginId, tokenValue, loginParameter);
		// }
	}
			
	/**
	 * 事件发布：xx 账号注销
	 * @param {string} loginType 账号类别
     * @param {Object} loginId 账号id
     * @param {string} tokenValue token值
	 */
    static doLogout(loginType, loginId, tokenValue) {
        this.listenerList.forEach(listener => {
            listener.doLogout(loginType, loginId, tokenValue);
        });
    }
	// public static void doLogout(String loginType, Object loginId, String tokenValue) {
	// 	for (SaTokenListener listener : listenerList) {
	// 		listener.doLogout(loginType, loginId, tokenValue);
	// 	}
	// }
	
	/**
	 * 事件发布：xx 账号被踢下线
	 * @param {string} loginType 账号类别 
     * @param {Object} loginId 账号id 
     * @param {string} tokenValue token值 
	 */
	static doKickout(loginType, loginId, tokenValue) {
        this.listenerList.forEach(listener => {
            listener.doKickout(loginType, loginId, tokenValue);
        });
    }

	/**
	 * 事件发布：xx 账号被顶下线
	 * @param {string} loginType 账号类别
     * @param {Object} loginId 账号id
     * @param {string} tokenValue token值
	 */
	static doReplaced(loginType, loginId, tokenValue) {
        this.listenerList.forEach(listener => {
            listener.doReplaced(loginType, loginId, tokenValue);
        });
    }

	/**
	 * 事件发布：xx 账号被封禁
	 * @param {string} loginType 账号类别
     * @param {Object} loginId 账号id
     * @param {string} service 指定服务 
     * @param {number} level 封禁等级 
     * @param {number} disableTime 封禁时长，单位: 秒
	 */
	static doDisable(loginType, loginId, service, level, disableTime) {
        this.listenerList.forEach(listener => {
            listener.doDisable(loginType, loginId, service, level, disableTime);
        });
    }
	
	/**
	 * 事件发布：xx 账号被解封
	 * @param {string} loginType 账号类别
     * @param {Object} loginId 账号id
     * @param {string} service 指定服务 
	 */
	static doUntieDisable(loginType, loginId, service) {
        this.listenerList.forEach(listener => {
            listener.doUntieDisable(loginType, loginId, service);
        });
    }

	/**
	 * 事件发布：xx 账号完成二级认证
	 * @param {string} loginType 账号类别
     * @param {string} tokenValue token值
     * @param {string} service 指定服务 
     * @param {number} safeTime 认证时间，单位：秒 
	 */
	static doOpenSafe(loginType, tokenValue, service, safeTime) {
        this.listenerList.forEach(listener => {
            listener.doOpenSafe(loginType, tokenValue, service, safeTime);
        });
    }

	/**
	 * 事件发布：xx 账号关闭二级认证
	 * @param {string} loginType 账号类别
     * @param {string} service 指定服务 
     * @param {string} tokenValue token值
	 */
	static doCloseSafe(loginType, tokenValue, service) {
        this.listenerList.forEach(listener => {
            listener.doCloseSafe(loginType, tokenValue, service);
        });
    }

	/**
	 * 事件发布：创建了一个新的 SaSession
	 * @param {string} id SessionId
	 */
	static doCreateSession(id) {
        this.listenerList.forEach(listener => {
            listener.doCreateSession(id);
        });
    }
	
	/**
	 * 事件发布：一个 SaSession 注销了
	 * @param {string} id SessionId
	 */
	static doLogoutSession(id) {
        this.listenerList.forEach(listener => {
            listener.doLogoutSession(id);
        });
    }

	/**
	 * 每次 Token 续期时触发（注意：是 timeout 续期，而不是 active-timeout 续期）
	 *
	 * @param {string} loginType 账号类别
     * @param {Object} loginId 账号id
     * @param {string} tokenValue token 值
     * @param {number} timeout 续期时间
	 */
	static doRenewTimeout(loginType, loginId, tokenValue, timeout) {
        this.listenerList.forEach(listener => {
            listener.doRenewTimeout(loginType, loginId, tokenValue, timeout);
        });
    }

	/**
	 * 事件发布：有新的全局组件载入到框架中
	 * @param {string} compName 组件名称
     * @param {Object} compObj 组件对象
	 */
	static doRegisterComponent(compName, compObj) {
        this.listenerList.forEach(listener => {
            listener.doRegisterComponent(compName, compObj);
        });
    }

	/**
	 * 事件发布：有新的注解处理器载入到框架中
	 * @param {SaAnnotationHandlerInterface} handler 注解处理器
	 */
	static doRegisterAnnotationHandler(handler) {
        this.listenerList.forEach(listener => {
            listener.doRegisterAnnotationHandler(handler);
        });
    }

	/**
	 * 事件发布：有新的 StpLogic 载入到框架中
	 * @param {StpLogic} stpLogic 
	 */
	static doSetStpLogic(stpLogic) {
        this.listenerList.forEach(listener => {
            listener.doSetStpLogic(stpLogic);
        });
    }

	/**
	 * 事件发布：有新的全局配置载入到框架中
	 * @param {SaTokenConfig} config 
	 */
	static doSetConfig(config) {
        this.listenerList.forEach(listener => {
            listener.doSetConfig(config);
        });
    }

}

exports.SaTokenEventCenter = SaTokenEventCenter;
exports.default = SaTokenEventCenter;
