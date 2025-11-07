import { Color } from '../src/Color.js';

console.log('🚀 Fast-Color-Js Benchmark\n');

function benchmark(name, fn, iterations = 1000000) {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        fn(i);
    }
    const time = performance.now() - start;
    console.log(`${name}: ${time.toFixed(2)}ms (${iterations} ops)`);
    return time;
}

// Benchmark suite
benchmark('hexToNumber', () => Color.hexToNumber("#a1b2c3"));
benchmark('numberToHex', () => Color.numberToHex(0xA1B2C3));
benchmark('rgbToNumber', () => Color.rgbToNumber(161, 178, 195));
benchmark('numberToRgb', () => Color.numberToRgb(0xA1B2C3));
benchmark('isHex', () => Color.isHex("#a1b2c3"));

console.log('\n✅ Benchmark completed!');