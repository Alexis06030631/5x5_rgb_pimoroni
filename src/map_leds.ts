import leds from'./leds.json'

const defaultMap = {
	0: {
		x: 0,
		y: 0
	},
	1: {
		x: 0,
		y: 1
	},
	2: {
		x: 0,
		y: 2
	},
	3: {
		x: 0,
		y: 3
	},
	4: {
		x: 0,
		y: 4
	},
	5: {
		x: 1,
		y: 4
	},
	6: {
		x: 1,
		y: 3
	},
	7: {
		x: 1,
		y: 2
	},
	8: {
		x: 1,
		y: 1
	},
	9: {
		x: 1,
		y: 0
	},
	10: {
		x: 2,
		y: 0
	},
	11: {
		x: 2,
		y: 1
	},
	12: {
		x: 2,
		y: 2
	},
	13: {
		x: 2,
		y: 3
	},
	14: {
		x: 2,
		y: 4
	},
	15: {
		x: 3,
		y: 4
	},
	16: {
		x: 3,
		y: 3
	},
	17: {
		x: 3,
		y: 2
	},
	18: {
		x: 3,
		y: 1
	},
	19: {
		x: 3,
		y: 0
	},
	20: {
		x: 4,
		y: 0
	},
	21: {
		x: 4,
		y: 1
	},
	22: {
		x: 4,
		y: 2
	},
	23: {
		x: 4,
		y: 3
	},
	24: {
		x: 4,
		y: 4
	}
}


module.exports = {
	getLedPosition: (ledId=0, map=defaultMap) => {
		// @ts-ignore
		return map[ledId]
	},

	getLedId: (x=0, y=0, map=defaultMap) => {
		for (const [ledId, led] of Object.entries(map)) {
			if (led.x === x && led.y === y) {
				return ledId
			}
		}
		return null
	},

	getLedRGB: (ledId=0) => {
		return leds[ledId]
	},

	getLedRGBByPosition: (x=0, y=0, map=defaultMap) => {
		const ledId = module.exports.getLedId(x, y, map)
		if (ledId === null) throw new Error(`No led found at position (x=${x}, y=${y})`)
		return module.exports.getLedRGB(ledId)
	}
}