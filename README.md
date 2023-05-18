# 5x5 Matrix led from Pimoroni

## Installation

```bash
npm install 5x5_rgb_pimoroni
```

## Description

A module to control the 5x5 matrix led from Pimoroni.

## Usage

```javascript
const RGB_pimoroni = require('5x5_matrix_pimoroni')

const rgb = new RGB_pimoroni(ADDRESS_OF_THE_I2C_BUS=0x74, BUS_NUMBER=1)

rgb.set_pixel(x=0, y=0, r=255, g=0, b=0)
```

--- 

## Methods

### On or Off the LED matrix
```javascript
rgb.Stop(false) // On
rgb.Stop(true) // Off
```

### Set the color of a pixel
```javascript
rgb.setColorLed(x, y, r, g, b, brightness=1)
```

### Set the color of ALL pixels
```javascript
rgb.setColor(r, g, b, brightness=1)
```

### Make blink matrix
```javascript
rgb.blink(speed=100)
```

### Stop blink matrix
```javascript
rgb.stopAnimations()
```

### Create a crossMark
```javascript
rgb.crossMark(r,g, b, brightness=1, speed=100)
```

### Create a validMark
```javascript
rgb.validMark(r,g, b, brightness=1, speed=100)
```

--- 

## Make By Alexis06030631
[Instagram](https://www.instagram.com/leko_system/)
