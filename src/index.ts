import "./checkUpdate"
import * as i2c from 'i2c-bus'
import * as ledMap from './map_leds'
// @ts-ignore
import {FRAMES_REGISTER, GAIN_REGISTER, FRAMES_CHECK, LEDS_MAP, FRAME_EDIT, ledsNumber, LEDS_5X5_MAP_BY_ROW} from './utils.json'

module.exports = class RGB_pimoroni {
	public addr: number;
	public busNumber: number;
	public bus: any;
	public ledMap: any;
	public anim_interval: any;
	public stop_snake_state: any;
	public lastColorsArray: Array<any>
	constructor(addr=0x74, busNumber=1) {
		this.addr = addr
		this.busNumber = busNumber
		this.bus = i2c.openSync(this.busNumber);
		this.ledMap = ledMap

		this.anim_interval = false
		this.stop_snake_state = false

		this.lastColorsArray = [
			{
				cmd: 36,
				data: new Array(32).fill(0)
			},
			{
				cmd: 68,
				data: new Array(32).fill(0)
			},
			{
				cmd: 100,
				data: new Array(32).fill(0)
			},
			{
				cmd: 132,
				data: new Array(32).fill(0)
			},
			{
				cmd: 164,
				data: new Array(16).fill(0)
			}
		]

		this.init()

		process.on('SIGINT', () => {
			this.init()
			this.Stop()
			process.exit()
		})
	}

	init(){
		this.setColor(0, 0, 0, 0)
		this.reset()
	}

	reset(){
		this.sendCommand(0, [1], true)
		this.sendCommand(36, [0], true)
		this.sendCommand(68, [0], true)
		this.sendCommand(100, [0], true)
		this.sendCommand(132, [0], true)
		this.sendCommand(164, [0], true)
		this.sendCommand(253, [11], true)
		this.sendCommand(1, [1], true)
	}

	/**
	 * Send command with i2c protocol
	 * @param {Number} cmd - The command number to execute
	 * @param {array} data - The data to parse in command
	 * @param useFrames
	 */
	sendCommand(cmd:number, data:Array<any> = [], useFrames=false){
		const view = Buffer.from(data)
		if(!useFrames) this.sendCommand(FRAME_EDIT, [GAIN_REGISTER], true)
		this.bus.writeI2cBlockSync(this.addr, cmd, view.length, view)
	}

	/**
	 * Send multiple commands
	 * @param {array<cmds>} array
	 * @param {number} mode - The mode to use (NOT USE IT)
	 */
	sendArrayRequests(array:Array<any>, mode=FRAMES_REGISTER) {
		this.sendCommand(FRAME_EDIT, [mode], true)
		for (let i = 0; i < array.length; i++) {
			this.sendCommand(array[i].cmd, array[i].data, true)
		}
		if(mode === FRAMES_REGISTER){
			this.sendArrayRequests(array, FRAMES_CHECK)
		}
	}

	Stop(yes=true){
		this.sendCommand(10, [!yes])
	}

	getMapArraySendColors(UseLastColors=true){
		if(UseLastColors){
			return this.lastColorsArray
		}else{
			const cmds = []
			for (const [cmd, value] of Object.entries(LEDS_MAP)) {
				cmds.push({
					cmd: Number(cmd),
					data: new Array(value).fill(0)
				})
			}
			return cmds
		}
	}

	/**
	 * Set the color of a LED
	 * @param {number} x - The x position of the LED
	 * @param {number} y - The y position of the LED
	 * @param {number} r - The red value
	 * @param {number} g - The green value
	 * @param {number} b - The blue value
	 * @param {number} brightness - The brightness value
	 * @param {boolean} update - Update the LED
	 * @param (data)
	 */
	setColorLed(x:number,y:number, r=0, g=0, b=0, brightness=1, update=true, data?:Array<any>) {
		data = data||this.getMapArraySendColors()
		const led_data = this.ledMap.getLedRGBByPosition(x, y)
		data.filter((e:any) => e.cmd === led_data.red.cmd)[0].data[led_data.red.nb-1] = Math.round(r * brightness * 0.609)
		data.filter((e:any) => e.cmd === led_data.green.cmd)[0].data[led_data.green.nb-1] = Math.round(g * brightness * 0.609)
		data.filter((e:any) => e.cmd === led_data.blue.cmd)[0].data[led_data.blue.nb-1] = Math.round(b * brightness * 0.609)

		if(update) this.sendArrayRequests(data)
		else return data
	}

	/**
	 * Set the color of all LEDs
	 * @param r
	 * @param g
	 * @param b
	 * @param brightness
	 */
	setColor(r=0, g=0, b=0, brightness=1) {
		let data = []
		for (let i = 0; i < ledsNumber; i++) {
			const led_data = this.ledMap.getLedPosition(i)
			if(!data.length){
				data = this.setColorLed(led_data.x, led_data.y, r, g, b, brightness, false)
			}else {
				data = this.setColorLed(led_data.x, led_data.y, r, g, b, brightness, false, data)
			}
		}
		this.sendArrayRequests(data)

	}

	/**
	 *
	 * @param r
	 * @param g
	 * @param b
	 * @param brightness
	 * @param back
	 * @param led
	 * @param speed
	 */
	snake(r:number=0, g:number=255, b:number=0, brightness=1, back=false, led=0, speed= 10) {
		if(this.stop_snake_state) return this.stop_snake_state = false
		const led_data = this.ledMap.getLedPosition(led)
		this.setColorLed(led_data.x, led_data.y, r, g, b, brightness)
		setTimeout(() => {
			led = back ? led - 1 : led + 1
			if(led === 25 || led === 0) {
				back = !back
				if(led === 0) led = 0
				else led = 23
			}
			this.snake(r, g, b, brightness, back, led, speed)
		}, speed)
	}

	stopSnake() {
		this.stop_snake_state = true
	}

	/**
	 * Blink all LEDs
	 * @param {number} speed - The speed of blink
	 */
	blink(speed=1000) {
		this.stopAnimations()
		let on = true
		this.anim_interval = setInterval(() => {
			this.Stop(!on)
			on = !on
		}, speed)
	}

	rainbow(speed=1000, w=0, h=0, r=255, g=0, b=0) {
		if(this.stop_snake_state) return this.stop_snake_state = false
		if(h === 5) {
			h = 0
			w++
		}
		if(w >= 5) {
			r = Math.round(Math.random() * 255)
			g = Math.round(Math.random() * 255)
			b = Math.round(Math.random() * 255)
			w = 0
			h = 0
		}
		this.setColorLed(w, h, r, g, b)
		setTimeout(() => {
			this.rainbow(speed, w, h+1, r, g, b)
		}, speed)
	}

	/**
	 * Stop blinking
	 */
	stopAnimations() {
		clearInterval(this.anim_interval)
		this.Stop(false)
	}

	/**
	 * Make a Cross Mark
	 * @param {number} r - The red value
	 * @param {number} g - The green value
	 * @param {number} b - The blue value
	 * @param {number} brightness - The brightness value
	 **/
	crossMark(r=255, g=0, b=0, brightness=1, speed=10) {
		this.setColor(0,0,0)
		this.setColorLed(0, 0, r, g, b, brightness)
		setInterval(() => this.setColorLed(1, 1, r, g, b, brightness), speed)
		setInterval(() => this.setColorLed(2, 2, r, g, b, brightness), speed*2)
		setInterval(() => this.setColorLed(3, 3, r, g, b, brightness), speed*3)
		setInterval(() => this.setColorLed(4, 4, r, g, b, brightness), speed*4)
		setInterval(() => this.setColorLed(0, 4, r, g, b, brightness), speed*5)
		setInterval(() => this.setColorLed(1, 3, r, g, b, brightness), speed*6)
		setInterval(() => this.setColorLed(2, 2, r, g, b, brightness), speed*7)
		setInterval(() => this.setColorLed(3, 1, r, g, b, brightness), speed*8)
		setInterval(() => this.setColorLed(4, 0, r, g, b, brightness), speed*9)
	}

	/**
	 * Make a validation mark
	 * @param {number} r - The red value
	 * @param {number} g - The green value
	 * @param {number} b - The blue value
	 * @param {number} brightness - The brightness value
	 **/
	validMark(r=0, g=255, b=0, brightness=1, speed=10) {
		this.setColor(0,0,0)
		this.setColorLed(0, 2, r, g, b, brightness)
		setInterval(() => this.setColorLed(1, 1, r, g, b, brightness), speed)
		setInterval(() => this.setColorLed(2, 0, r, g, b, brightness), speed*2)
		setInterval(() => this.setColorLed(3, 1, r, g, b, brightness), speed*3)
		setInterval(() => this.setColorLed(4, 2, r, g, b, brightness), speed*4)
		setInterval(() => this.setColorLed(3, 3, r, g, b, brightness), speed*5)
		setInterval(() => this.setColorLed(2, 4, r, g, b, brightness), speed*6)
		setInterval(() => this.setColorLed(1, 3, r, g, b, brightness), speed*7)
	}

}

/**
 * @typedef cmds
 * @param {number} cmd - The command name
 * @param {array} data - The array of data
 */