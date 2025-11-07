##Example

import { Color } from 'fast-color-js';

// Ultra-fast conversions
const num = Color.hexToNumber("#ff8040");
const hex = Color.numberToHex(16746432);
const rgb = Color.numberToRgb(16746432); // {r: 255, g: 128, b: 64}


// Process 1M colors in ~250ms
const hexArray = ["#ff0000", "#00ff00", "#0000ff", /*...1M items*/];
const numbers = hexArray.map(Color.hexToNumber);


// Generate harmonious palettes
const palette = Color.generatePaletteHSV(8);
const randomColor = Color.randomHexRgb();