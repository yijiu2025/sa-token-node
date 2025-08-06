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
 * 十六进制工具类
 *
 * @author deepseek
 * @since 2025/2/24
 */
class SaHexUtil {

    // 十六进制字符表（大写）
    static #HEX_ARRAY = '0123456789ABCDEF'.split('');

    /**
     * 将字节数组转换为十六进制字符串（JDK8兼容）
     * @param {byte[]} bytes 要转换的字节数组
     * @return {String} 十六进制字符串（大写）
     */
    static bytesToHex(bytes) {
        if (bytes == null) return null;
        const hexChars = new Array(bytes.length * 2);
        for (let i = 0; i < bytes.length; i++) {
            const v = bytes[i] & 0xFF;
            hexChars[i * 2] = SaHexUtil.#HEX_ARRAY[v >>> 4];
            hexChars[i * 2 + 1] = SaHexUtil.#HEX_ARRAY[v & 0x0F];
        }
        return hexChars.join('');
    }

    /**
     * 将十六进制字符串转换为字节数组（JDK8兼容）
     * @param {String} hexString 有效的十六进制字符串（不区分大小写）
     * @return {byte[]} 对应的字节数组
     * @throws IllegalArgumentException 输入字符串格式错误时抛出异常
     */
    static hexToBytes(hexString) {
        if (hexString == null) return null;
        const len = hexString.length;
        if (len % 2 != 0) {
            throw new Error("Hex string must have even length");
        }

        const data = new Uint8Array(len / 2);
        for (let i = 0; i < len; i += 2) {
            const high = SaHexUtil.#digit(hexString.charAt(i), 16);
            const low = SaHexUtil.#digit(hexString.charAt(i + 1), 16);

            if (high == -1 || low == -1) {
                throw new Error(
                    "Invalid hex character at position " + i + " or " + (i + 1)
                );
            }

            data[i / 2] = (high << 4) + low;
        }
        return data;
    }

    /**
     * 私有方法：模拟 Java 的 Character.digit()
     * @param {string} ch 字符
     * @param {number} radix 基数
     * @return {number} 数字值或-1
     */
    static #digit(ch, radix) {
        // 仅处理16进制情况（保持与Java版本相同的限制）
        if (radix !== 16) {
            return -1;
        }
        const code = ch.toUpperCase().charCodeAt(0);
        if (code >= 48 && code <= 57) return code - 48; // 0-9
        if (code >= 65 && code <= 70) return code - 55; // A-F
        return -1;
    }

    /**
     * 以Java风格打印字节数组（带0x前缀的十六进制）
     * @param {Uint8Array} bytes 
     */
    static printJavaHexStyle(bytes) {
        if (!bytes) {
            console.log("null");
            return;
        }
        const hexStrings = Array.from(bytes).map(b => 
            '0x' + b.toString(16).padStart(2, '0').toUpperCase()
        );
        console.log("Byte array: [" + hexStrings.join(' ') + " ]");
    }

}
export default SaHexUtil;