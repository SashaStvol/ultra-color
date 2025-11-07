/**
 * Ultra-fast color manipulation library for games and real-time applications
 * @class Color
 * @version 1.0.0
 * @author SashaStvol
 * @license MIT
 */
export class Color {
    /**
     * Lookup table for hex digits (0-9, a-f)
     * @type {string}
     * @static
     * @readonly
     */
    static HEX = "0123456789abcdef";

    // Commented out shared objects for safety
    // static #rgb = {r:0,g:0,b:0};
    // static #rgba = {r:0,g:0,b:0,a:0};

    /**
     * Generates random integer in range [min, max] (inclusive)
     * @param {number} min - Minimum value (inclusive)
     * @param {number} max - Maximum value (inclusive)
     * @returns {number} Random integer between min and max
     * @private
     * @static
     */
    static #random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /**
     * Converts RGB components to packed number (0xRRGGBB)
     * Uses bit shifting for maximum performance
     * @param {number} r - Red component (0-255)
     * @param {number} g - Green component (0-255)
     * @param {number} b - Blue component (0-255)
     * @returns {number} Packed RGB number (0xRRGGBB)
     * @static
     * @example
     * Color.rgbToNumber(200, 100, 56) // → 13132856 (0xC86438)
     * Color.rgbToNumber(111, 111, 111) // → 7303023 (0x6F6F6F)
     */
    static rgbToNumber(r, g, b) {
        return (r << 16) | (g << 8) | b;
    }

    /**
     * Converts RGBA components to packed number (0xRRGGBBAA)
     * Uses multiplication to avoid 32-bit overflow issues
     * @param {number} r - Red component (0-255)
     * @param {number} g - Green component (0-255)
     * @param {number} b - Blue component (0-255)
     * @param {number} a - Alpha component (0-255)
     * @returns {number} Packed RGBA number (0xRRGGBBAA)
     * @static
     * @example
     * Color.rgbaToNumber(200, 100, 56, 180) // → 3362011316 (0xC86438B4)
     * Color.rgbaToNumber(111, 111, 111, 111) // → 1869573999 (0x6F6F6F6F)
     */
    static rgbaToNumber(r, g, b, a) {
        return r * 16777216 + g * 65536 + b * 256 + a;
    }

    /**
     * Converts packed RGB number to RGB object
     * @param {number} num - Packed RGB number (0xRRGGBB)
     * @returns {Object} RGB object with r, g, b properties (0-255)
     * @static
     * @example
     * Color.numberToRgb(13132856) // → {r: 200, g: 100, b: 56}
     */
    static numberToRgb(num) {
        return {
            r: num >>> 16 & 255,
            g: num >>> 8 & 255,
            b: num & 255
        };
    }

    /**
     * Converts packed RGBA number to RGBA object
     * Uses bit masks for component extraction
     * @param {number} num - Packed RGBA number (0xRRGGBBAA)
     * @returns {Object} RGBA object with r, g, b, a properties (0-255)
     * @static
     * @example
     * Color.numberToRgba(3362011316) // → {r: 200, g: 100, b: 56, a: 180}
     */
    static numberToRgba(num) {
        return {
            r: (num & 4278190080) >>> 24,  // Mask: 0xFF000000
            g: (num & 16711680) >>> 16,    // Mask: 0x00FF0000  
            b: (num & 65280) >>> 8,        // Mask: 0x0000FF00
            a: num & 255                   // Mask: 0x000000FF
        };
    }

    /**
     * Converts HEX string to number using bit operations (fast)
     * Safe up to 2^28-1 (0xFFFFFFF, 7 hex digits)
     * @param {string} hex - HEX color string with or without #
     * @returns {number} Packed RGB number
     * @static
     * @example
     * Color.hexToNumberBit("#a1b2c3") // → 10597059
     * Color.hexToNumberBit("ffffff")  // → 16777215
     */
    static hexToNumberBit(hex) {
        let num = 0;
        for (let i =  hex[0] === "#" ? 1 : 0; i < hex.length; i++) {
            // Mathematical formula converts hex chars to numbers:
            // '0'-'9' → 0-9, 'A'-'F'/'a'-'f' → 10-15
            num = (num << 4) | (hex.charCodeAt(i) % 32 + 9) % 25;
        }
        return num;
    }

    /**
     * Converts HEX string to number using arithmetic (safe for large numbers)
     * Safe up to 2^53 (JavaScript number precision limit)
     * @param {string} hex - HEX color string with or without #
     * @returns {number} Packed RGB number
     * @static
     * @example
     * Color.hexToNumber("#a1b2c3d4") // → 2712847316
     * Color.hexToNumber("20000000000000") // → 9007199254740992
     */
    static hexToNumber(hex) {
        let num = 0;
        for (let i =  hex[0] === "#" ? 1 : 0; i < hex.length; i++) {
            num = num * 16 + (hex.charCodeAt(i) % 32 + 9) % 25;
        }
        return num;
    }

    /**
     * Validates HEX color string format
     * Supports #RGB, #RGBA, #RRGGBB, #RRGGBBAA formats
     * @param {string} hex - HEX string to validate
     * @returns {boolean} True if valid HEX format
     * @static
     * @example
     * Color.isHex("#abc")    // → true (short RGB)
     * Color.isHex("#abcd")   // → true (short RGBA)
     * Color.isHex("#a1b2c3") // → true (RGB)
     * Color.isHex("#a1b2c3d4") // → true (RGBA)
     * Color.isHex("#xyz123") // → false
     */
    static isHex(hex) {
        if (typeof hex !== "string" || hex[0] !== "#") return false;
        let len = hex.length - 1;
        if (len !== 6 && len !== 8 && len !== 3 && len !== 4) return false;
        for (let i = 1; i < hex.length; i++) {
            if ((hex.charCodeAt(i) % 32 + 9) % 25 > 15) return false;
        }
        return true;
    }

    /**
     * Converts HEX string to RGB object
     * Uses fast bit manipulation for RGB, safe arithmetic for RGBA
     * @param {string} hex - HEX color string
     * @returns {Object} RGB object {r, g, b}
     * @static
     */
    static hexToRgb(hex) {
        return Color.numberToRgb(Color.hexToNumberBit(hex));
    }

    /**
     * Converts HEX string to RGBA object
     * Uses safe arithmetic to handle alpha channel
     * @param {string} hex - HEX color string
     * @returns {Object} RGBA object {r, g, b, a}
     * @static
     */
    static hexToRgba(hex) {
        return Color.numberToRgba(Color.hexToNumber(hex));
    }

    /**
     * Generates random RGB color number
     * @returns {number} Random RGB number (0x000000 - 0xFFFFFF)
     * @static
     */
    static randomRgb() {
        return Color.#random(0, 16777215); // Mask: 0xFFFFFF
    }

    /**
     * Generates random RGBA color number
     * @returns {number} Random RGBA number (0x00000000 - 0xFFFFFFFF)
     * @static
     */
    static randomRgba() {
        return Color.#random(0, 4294967295); // Mask: 0xFFFFFFFF
    }

    /**
     * Generates random HEX RGB color string
     * @returns {string} Random HEX RGB color (#RRGGBB)
     * @static
     */
    static randomHexRgb() {
        return Color.numberToHexRgb(Color.randomRgb());
    }

    /**
     * Generates random HEX RGBA color string
     * @returns {string} Random HEX RGBA color (#RRGGBBAA)
     * @static
     */
    static randomHexRgba() {
        return Color.numberToHexRgba(Color.randomRgba());
    }

    /**
     * Generates random RGB color object
     * @returns {Object} Random RGB object {r, g, b}
     * @static
     */
    static randomRgbObject() {
        return Color.numberToRgb(Color.randomRgb());
    }

    /**
     * Generates random RGBA color object
     * @returns {Object} Random RGBA object {r, g, b, a}
     * @static
     */
    static randomRgbaObject() {
        return Color.numberToRgba(Color.randomRgba());
    }

    /**
     * Generates random bright RGB color number
     * All components are between 128-255 for high brightness
     * @returns {number} Random bright RGB number
     * @static
     */
    static randomBrightNumberRgb() {
        let r = Color.#random(128, 255),
            g = Color.#random(128, 255), 
            b = Color.#random(128, 255);
        return Color.rgbToNumber(r, g, b);
    }

    /**
     * Generates random pastel RGB color number
     * All components are between 180-230 for soft colors
     * @returns {number} Random pastel RGB number
     * @static
     */
    static randomPastelNumberRgb() {
        let r = Color.#random(180, 230),
            g = Color.#random(180, 230),
            b = Color.#random(180, 230);
        return Color.rgbToNumber(r, g, b);
    }

    /**
     * Generates random bright RGBA color number
     * @returns {number} Random bright RGBA number
     * @static
     */
    static randomBrightNumberRgba() {
        let r = Color.#random(128, 255),
            g = Color.#random(128, 255),
            b = Color.#random(128, 255),
            a = Color.#random(128, 255);
        return Color.rgbaToNumber(r, g, b, a);
    }

    /**
     * Generates random pastel RGBA color number
     * @returns {number} Random pastel RGBA number
     * @static
     */
    static randomPastelNumberRgba() {
        let r = Color.#random(180, 230),
            g = Color.#random(180, 230),
            b = Color.#random(180, 230),
            a = Color.#random(180, 230);
        return Color.rgbaToNumber(r, g, b, a);
    }

    /**
     * Converts RGB components to HEX string
     * Uses lookup table for maximum performance
     * @param {number} r - Red component (0-255)
     * @param {number} g - Green component (0-255)
     * @param {number} b - Blue component (0-255)
     * @returns {string} HEX color string (#RRGGBB)
     * @static
     */
    static rgbToHex(r, g, b) {
        return '#' + 
            Color.HEX[r >> 4] + Color.HEX[r & 15] +
            Color.HEX[g >> 4] + Color.HEX[g & 15] +
            Color.HEX[b >> 4] + Color.HEX[b & 15];
    }

    /**
     * Converts RGBA components to HEX string
     * @param {number} r - Red component (0-255)
     * @param {number} g - Green component (0-255)
     * @param {number} b - Blue component (0-255)
     * @param {number} a - Alpha component (0-255)
     * @returns {string} HEX color string (#RRGGBBAA)
     * @static
     */
    static rgbaToHex(r, g, b, a) {
        return '#' + 
            Color.HEX[r >> 4] + Color.HEX[r & 15] +
            Color.HEX[g >> 4] + Color.HEX[g & 15] +
            Color.HEX[b >> 4] + Color.HEX[b & 15] +
            Color.HEX[a >> 4] + Color.HEX[a & 15];
    }

    /**
     * Converts RGB number to HEX string
     * @param {number} num - Packed RGB number (0xRRGGBB)
     * @returns {string} HEX color string (#RRGGBB)
     * @static
     */
    static numberToHexRgb(num) {
        let r = num >>> 16 & 255,
            g = num >>> 8 & 255, 
            b = num & 255;
        return Color.rgbToHex(r, g, b);
    }

    /**
     * Converts RGBA number to HEX string
     * @param {number} num - Packed RGBA number (0xRRGGBBAA)
     * @returns {string} HEX color string (#RRGGBBAA)
     * @static
     */
    static numberToHexRgba(num) {
        let r = (num & 4278190080) >>> 24,   // Mask: 0xFF000000
            g = (num & 16711680) >>> 16,     // Mask: 0x00FF0000
            b = (num & 65280) >>> 8,         // Mask: 0x0000FF00
            a = num & 255;                   // Mask: 0x000000FF
        return Color.rgbaToHex(r, g, b, a);
    }

    /**
     * Converts HSV color to RGB components
     * @param {number} h - Hue (0-360 degrees)
     * @param {number} s - Saturation (0-100%)
     * @param {number} v - Value/Brightness (0-100%)
     * @returns {number[]} RGB components [r, g, b] (0-255)
     * @static
     * @example
     * Color.hsvToRgb(0, 100, 100) // → [255, 0, 0] (red)
     * Color.hsvToRgb(120, 100, 100) // → [0, 255, 0] (green)
     */
    static hsvToRgb(h, s, v) {
        h = h % 360;
        if (h < 0) h += 360;
        s = Math.max(0, Math.min(100, s)) / 100;
        v = Math.max(0, Math.min(100, v)) / 100;
        
        let c = v * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = v - c;
        let r, g, b;
        
        if (h >= 0 && h < 60) {
            [r, g, b] = [c, x, 0];
        } else if (h >= 60 && h < 120) {
            [r, g, b] = [x, c, 0];
        } else if (h >= 120 && h < 180) {
            [r, g, b] = [0, c, x];
        } else if (h >= 180 && h < 240) {
            [r, g, b] = [0, x, c];
        } else if (h >= 240 && h < 300) {
            [r, g, b] = [x, 0, c];
        } else {
            [r, g, b] = [c, 0, x];
        }
        
        return [
            Math.round((r + m) * 255),
            Math.round((g + m) * 255),
            Math.round((b + m) * 255)
        ];
    }
    
    /**
     * Converts RGB components to HSV color
     * @param {number} r - Red component (0-255)
     * @param {number} g - Green component (0-255)
     * @param {number} b - Blue component (0-255)
     * @returns {number[]} HSV values [h, s, v] (0-360, 0-100, 0-100)
     * @static
     * @example
     * Color.rgbToHsv(255, 0, 0) // → [0, 100, 100] (red)
     * Color.rgbToHsv(0, 255, 0) // → [120, 100, 100] (green)
     */
    static rgbToHsv(r, g, b) {
        r = r / 255;
        g = g / 255;
        b = b / 255;
        
        let max = Math.max(r, g, b),
            min = Math.min(r, g, b),
            delta = max - min;
        
        let h = 0,
            s = max === 0 ? 0 : delta / max,
            v = max;
        
        if (delta !== 0) {
            switch (max) {
                case r: h = (g - b) / delta + (g < b ? 6 : 0); break;
                case g: h = (b - r) / delta + 2; break;
                case b: h = (r - g) / delta + 4; break;
            }
            h /= 6;
        }
        
        return [
            Math.round(h * 360),
            Math.round(s * 100),
            Math.round(v * 100)
        ];
    }

    /**
     * Generates color palette with evenly distributed hues (HSV)
     * @param {number} count - Number of colors to generate
     * @returns {Uint32Array} Array of packed RGB numbers
     * @static
     */
    static generatePaletteHSV(count) {
        let palette = new Uint32Array(count),
            step = 360 / count;
        for (let i = 0; i < count; i++) {
            let hue = i * step;
            let [r, g, b] = Color.hsvToRgb(hue, 80, 60);
            palette[i] = Color.rgbToNumber(r, g, b);
        }
        return palette;
    }

    /**
     * Generates color palette using golden ratio for aesthetically pleasing distribution
     * @param {number} count - Number of colors to generate
     * @returns {Uint32Array} Array of packed RGB numbers
     * @static
     */
    static generatePaletteGolden(count) {
        let palette = new Uint32Array(count),
            goldenRatio = 0.618033988749895,
            hue = Math.random() * 360;
        for (let i = 0; i < count; i++) {
            hue = (hue + goldenRatio * 360) % 360;
            let [r, g, b] = Color.hsvToRgb(hue, 70, 65);
            palette[i] = Color.rgbToNumber(r, g, b);
        }
        return palette;
    }
}