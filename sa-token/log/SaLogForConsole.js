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
import SaTokenConfig from '../config/SaTokenConfig.js';
import StrFormatter from '../util/StrFormatter.js';
import SaLog from './SaLog.js';

/**
 * Sa-Token 日志实现类 [ 控制台打印 ]
 * 
 * @author click33 qirly
 * @since 1.33.0
 */
class SaLogForConsole extends SaLog {

	/**
	 * 日志等级 
	 */
    static TRACE = 1;
    static DEBUG = 2;
    static INFO = 3;
    static WARN = 4;
    static ERROR = 5;
    static FATAL = 6;

	/**
	 * 日志输出的前缀
	 */
    static LOG_PREFIX = "SaLog -->: ";
    static TRACE_PREFIX = "SA [TRACE]-->: ";
    static DEBUG_PREFIX = "SA [DEBUG]-->: ";
    static INFO_PREFIX = "SA [INFO] -->: ";
    static WARN_PREFIX = "SA [WARN] -->: ";
    static ERROR_PREFIX = "SA [ERROR]-->: ";
    static FATAL_PREFIX = "SA [FATAL]-->: ";

	/**
	 * 日志输出的颜色
	 */
    static TRACE_COLOR = "\x1b[39m";
    static DEBUG_COLOR = "\x1b[34m";
    static INFO_COLOR = "\x1b[32m";
    static WARN_COLOR = "\x1b[33m";
    static ERROR_COLOR = "\x1b[31m";
    static FATAL_COLOR = "\x1b[35m";
    static DEFAULT_COLOR = "\x1b[39m";
	// public static String TRACE_COLOR = "\033[39m";
	// public static String DEBUG_COLOR = "\033[34m";
	// public static String INFO_COLOR  = "\033[32m";
	// public static String WARN_COLOR  = "\033[33m";
	// public static String ERROR_COLOR = "\033[31m";
	// public static String FATAL_COLOR = "\033[35m";

	// public static String DEFAULT_COLOR = "\033[39m";

    /**
     * 打印trace日志
     * @param {string} str 日志内容
     * @param {...any} args 参数
     */
	// @Override
	trace(str, ...args) {
		this.println(SaLogForConsole.TRACE, SaLogForConsole.TRACE_COLOR, SaLogForConsole.TRACE_PREFIX, str, args);
	}

    /**
     * 打印debug日志
     * @param {string} str 日志内容
     * @param {...any} args 参数
     */
	// @Override
	debug(str, ...args) {
		this.println(SaLogForConsole.DEBUG, SaLogForConsole.DEBUG_COLOR, SaLogForConsole.DEBUG_PREFIX, str, args);
	}

    /**
     * 打印info日志
     * @param {string} str 日志内容
     * @param {...any} args 参数
     */
	// @Override
	info(str, ...args) {
		this.println(SaLogForConsole.INFO, SaLogForConsole.INFO_COLOR, SaLogForConsole.INFO_PREFIX, str, args);
	}

    /**
     * 打印warn日志
     * @param {string} str 日志内容
     * @param {...any} args 参数
     */
	// @Override
	warn(str, ...args) {
		this.println(SaLogForConsole.WARN, SaLogForConsole.WARN_COLOR, SaLogForConsole.WARN_PREFIX, str, args);
	}

    /**
     * 打印error日志
     * @param {string} str 日志内容
     * @param {...any} args 参数
     */
	// @Override
	error(str, ...args) {
		this.println(SaLogForConsole.ERROR, SaLogForConsole.ERROR_COLOR, SaLogForConsole.ERROR_PREFIX, str, args);
	}

    /**
     * 打印fatal日志
     * @param {string} str 日志内容
     * @param {...any} args 参数
     */
	// @Override
	fatal(str, ...args) {
		this.println(SaLogForConsole.FATAL, SaLogForConsole.FATAL_COLOR, SaLogForConsole.FATAL_PREFIX, str, args);
	}

	/**
     * 打印日志到控制台
     * @param {int} level 日志等级
     * @param {string} color 颜色编码
     * @param {string} prefix 前缀
     * @param {string} str 字符串
     * @param {Array} args 参数列表
     */
	async println(level, color, prefix, str, args) {
		const config = await SaManager.getConfig();
		if(config.getIsLog() && level >= config.getLogLevelInt()) {
            const formattedMessage = this.formatMessage(str, args);
			if(config.getIsColorLog() == true) {
                // 彩色日志
                console.log(color + prefix + formattedMessage + SaLogForConsole.DEFAULT_COLOR);
				//System.out.println(color + prefix + StrFormatter.format(str, args) + DEFAULT_COLOR);
			} else {
				// 黑白日志
                console.log(prefix + formattedMessage);
				//System.out.println(prefix + StrFormatter.format(str, args));
			}
		}
	}
    formatMessage(str, args) {
        if (!args || args.length === 0) {
            return str;
        }
        
        // 简单实现，用{}作为占位符
        let result = str;
        for (const arg of args) {
            result = result.replace('{}', arg !== undefined ? arg.toString() : 'null');
        }
        return result;
    }

	/*
		// 三种写法速度对比
		// if( config.getIsColorLog() != null && config.getIsColorLog() )  10亿次，2058ms
		// if( config.getIsColorLog() == Boolean.TRUE ) 	10亿次，1050ms   最快
		// if( Objects.equals(config.getIsColorLog(), Boolean.TRUE) )  	10亿次，1543ms
	 */

	/*
		颜色参考：
			DEFAULT  	39
			BLACK  		30
			RED  		31
			GREEN  		32
			YELLOW  	33
			BLUE  		34
			MAGENTA  	35
			CYAN  		36
			WHITE  		37
			BRIGHT_BLACK  	90
			BRIGHT_RED  	91
			BRIGHT_GREEN  	92
			BRIGHT_YELLOW  	93
			BRIGHT_BLUE  	94
			BRIGHT_MAGENTA	95
			BRIGHT_CYAN  	96
			BRIGHT_WHITE  	97
	 */

}

// 导出单例实例
//const saLogForConsole = new SaLogForConsole();
export default SaLogForConsole;
