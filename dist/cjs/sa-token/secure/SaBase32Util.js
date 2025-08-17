'use strict';

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
 * Sa-Token Base32 工具类
 *
 * @author click33 qirly
 * @since 1.42.0
 */
class SaBase32Util {

    static BASE32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    static BASE32_LOOKUP = new Array(256).fill(-1);

    static {
        // 初始化解码查找表
        for (let i = 0; i < SaBase32Util.BASE32_CHARS.length; i++) {
            const c = SaBase32Util.BASE32_CHARS.charAt(i);
            SaBase32Util.BASE32_LOOKUP[c] = i;
            // 支持小写字母解码
            if (c >= 'A' && c <= 'Z') {
                const lowerCaseCode = c.toLowerCase().charCodeAt(0);
                SaBase32Util.BASE32_LOOKUP[lowerCaseCode] = i;
            }
        }
    }
    

    /**
     * Base32 编码（byte[] 转 String）
     */
    static encodeBytesToString(bytes) {
        if (bytes == null) return null;

        let result = "";
        let buffer = 0;
        let bufferSize = 0;

        for (let i = 0; i < bytes.length; i++) {
            const b = bytes[i] & 0xFF; // 确保是无符号字节
            buffer = (buffer << 8) | b;
            bufferSize += 8;

            while (bufferSize >= 5) {
                bufferSize -= 5;
                const index = (buffer >> bufferSize) & 0x1F;
                result += SaBase32Util.BASE32_CHARS[index];
            }
        }

        // 处理剩余位
        if (bufferSize > 0) {
            const index = (buffer << (5 - bufferSize)) & 0x1F;
            result += SaBase32Util.BASE32_CHARS[index];
        }

        return result;
    }

    /**
     * Base32 解码（String 转 byte[]）
     */
    static decodeStringToBytes(text) {
        if (text == null) return null;

        //text = text.replace(/=/g, '').trim();
        //text = text.split('=').join('').trim(); 兼容
        text = text.replaceAll('=', '').trim(); //现代 JS（Node.js v15+ / ES2021）
        if (text.length === 0) return new Uint8Array(0);

        let buffer = 0;
        let bufferSize = 0;
        const byteCount = Math.floor((text.length * 5 + 7) / 8);
        const bytes = new Uint8Array(byteCount);
        let byteIndex = 0;

        for (let i = 0; i < text.length; i++) {
            const c = text[i];
            const code = c.charCodeAt(0);
            const value = SaBase32Util.BASE32_LOOKUP[code];

            // 跳过非法字符（注意：'A' 对应 0，不能简单用 value === 0 判断）
            if (value === -1) continue;

            buffer = (buffer << 5) | value;
            bufferSize += 5;

            while (bufferSize >= 8) {
                bufferSize -= 8;
                bytes[byteIndex++] = (buffer >> bufferSize) & 0xFF;
            }
        }

        // 处理最后一个字节
        if (bufferSize > 0) {
            bytes[byteIndex] = (buffer << (8 - bufferSize)) & 0xFF;
        }

        return bytes;
    }

    /**
     * Base32 编码（String 转 String）
     */
    static encode(text) {
        if (text == null) return null;
        return SaBase32Util.encodeBytesToString(utf8ToBytes(text));
    }

    /**
     * Base32 解码（String 转 String）
     */
    static decode(base32Text) {
        if (base32Text == null) return null;
        const bytes = SaBase32Util.decodeStringToBytes(base32Text);
        return bytesToUtf8(bytes);
    }

}

// 工具方法：字符串转 Uint8Array（UTF-8）
function utf8ToBytes(str) {
    return new TextEncoder().encode(str);
}

// 工具方法：Uint8Array 转字符串（UTF-8）
function bytesToUtf8(bytes) {
    return new TextDecoder().decode(bytes);
}

module.exports = SaBase32Util;
