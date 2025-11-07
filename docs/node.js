#!/usr/bin/env node

/**
 * Ultra Color - Node.js Example
 * Demonstrates library usage in server-side applications
 */

import { Color } from '../src/Color.js';

console.log('🎨 Ultra Color - Node.js Examples\n');

// Example 1: Basic conversions
console.log('1. 🔄 Basic Color Conversions');
console.log('='.repeat(40));

const testHex = '#ff8040';
const testRgb = { r: 255, g: 128, b: 64 };

console.log(`HEX: ${testHex}`);
console.log(`→ Number: ${Color.hexToNumber(testHex)}`);
console.log(`→ RGB:`, Color.hexToRgb(testHex));

console.log(`\nRGB:`, testRgb);
console.log(`→ Number: ${Color.rgbToNumber(testRgb.r, testRgb.g, testRgb.b)}`);
console.log(`→ HEX: ${Color.rgbToHex(testRgb.r, testRgb.g, testRgb.b)}`);

// Example 2: Validation
console.log('\n2. ✅ HEX Validation');
console.log('='.repeat(40));

const testCases = ['#abc', '#a1b2c3', '#a1b2c3d4', '#invalid', 'abc123'];
testCases.forEach(hex => {
    console.log(`"${hex}" → ${Color.isHex(hex) ? 'VALID' : 'INVALID'}`);
});

// Example 3: Color generation
console.log('\n3. 🎲 Color Generation');
console.log('='.repeat(40));

console.log('Random colors:');
for (let i = 0; i < 3; i++) {
    const hex = Color.randomHexRgb();
    console.log(`  ${hex} (${Color.hexToNumber(hex)})`);
}

console.log('\nBright colors:');
for (let i = 0; i < 3; i++) {
    const hex = Color.numberToHexRgb(Color.randomBrightNumberRgb());
    console.log(`  ${hex}`);
}

console.log('\nPastel colors:');
for (let i = 0; i < 3; i++) {
    const hex = Color.numberToHexRgb(Color.randomPastelNumberRgb());
    console.log(`  ${hex}`);
}

// Example 4: Color palettes
console.log('\n4. 🎨 Color Palettes');
console.log('='.repeat(40));

console.log('HSV Palette (5 colors):');
const hsvPalette = Color.generatePaletteHSV(5);
hsvPalette.forEach((num, i) => {
    console.log(`  Color ${i + 1}: ${Color.numberToHexRgb(num)} (${num})`);
});

console.log('\nGolden Ratio Palette (5 colors):');
const goldenPalette = Color.generatePaletteGolden(5);
goldenPalette.forEach((num, i) => {
    console.log(`  Color ${i + 1}: ${Color.numberToHexRgb(num)} (${num})`);
});

// Example 5: Performance test
console.log('\n5. ⚡ Performance Test');
console.log('='.repeat(40));

function runPerformanceTest(iterations = 100000) {
    const testHex = '#a1b2c3';
    const testNum = 0xA1B2C3;
    
    // Test hexToNumber
    console.time(`hexToNumber (${iterations} ops)`);
    for (let i = 0; i < iterations; i++) {
        Color.hexToNumber(testHex);
    }
    console.timeEnd(`hexToNumber (${iterations} ops)`);
    
    // Test numberToHex
    console.time(`numberToHex (${iterations} ops)`);
    for (let i = 0; i < iterations; i++) {
        Color.numberToHex(testNum);
    }
    console.timeEnd(`numberToHex (${iterations} ops)`);
    
    // Test bulk operations
    console.time(`bulk processing (${iterations} colors)`);
    const hexArray = Array(iterations).fill(testHex);
    const numbers = hexArray.map(Color.hexToNumber);
    console.timeEnd(`bulk processing (${iterations} colors)`);
}

runPerformanceTest(100000);

// Example 6: Real-world use case - Image processing simulation
console.log('\n6. 🖼️ Image Processing Simulation');
console.log('='.repeat(40));

function simulateImageProcessing(width = 100, height = 100) {
    console.log(`Simulating ${width}x${height} image (${width * height} pixels)`);
    
    const pixels = width * height;
    const colorData = new Array(pixels);
    
    console.time('Generate pixel data');
    for (let i = 0; i < pixels; i++) {
        // Simulate different color generation strategies
        if (i % 3 === 0) {
            colorData[i] = Color.randomRgb(); // Random colors
        } else if (i % 3 === 1) {
            colorData[i] = Color.randomBrightNumberRgb(); // Bright colors
        } else {
            colorData[i] = Color.randomPastelNumberRgb(); // Pastel colors
        }
    }
    console.timeEnd('Generate pixel data');
    
    console.time('Convert to HEX strings');
    const hexData = colorData.map(Color.numberToHexRgb);
    console.timeEnd('Convert to HEX strings');
    
    console.log(`Generated ${pixels} colors with ${hexData.length} HEX values`);
    console.log('Sample colors:', hexData.slice(0, 5));
}

simulateImageProcessing(10, 10); // Small scale for demo

// Example 7: Advanced features
console.log('\n7. 🔧 Advanced Features');
console.log('='.repeat(40));

console.log('HSV/RGB Conversions:');
const redHsv = Color.rgbToHsv(255, 0, 0);
console.log(`RGB(255, 0, 0) → HSV(${redHsv[0]}, ${redHsv[1]}, ${redHsv[2]})`);

const greenHsv = Color.rgbToHsv(0, 255, 0);
console.log(`RGB(0, 255, 0) → HSV(${greenHsv[0]}, ${greenHsv[1]}, ${greenHsv[2]})`);

const blueRgb = Color.hsvToRgb(240, 100, 100);
console.log(`HSV(240, 100, 100) → RGB(${blueRgb[0]}, ${blueRgb[1]}, ${blueRgb[2]})`);

console.log('\n🎉 All examples completed!');
console.log('\nUsage tips:');
console.log('• Import: import { Color } from "ultra-color"');
console.log('• For bulk operations, use array methods with Color methods');
console.log('• Use hexToNumberBit() for RGB, hexToNumber() for RGBA');
console.log('• Check isHex() before processing user input');