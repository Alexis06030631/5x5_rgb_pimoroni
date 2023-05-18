import "./checkUpdate";
declare class RGB_pimoroni {
    addr: number;
    busNumber: number;
    bus: any;
    ledMap: any;
    anim_interval: any;
    stop_snake_state: any;
    lastColorsArray: Array<any>;
    constructor(addr?: number, busNumber?: number);
    init(): void;
    reset(): void;
    lastColorsReset(): {
        cmd: number;
        data: any[];
    }[];
    /**
     * Send command with i2c protocol
     * @param {Number} cmd - The command number to execute
     * @param {array} data - The data to parse in command
     * @param useFrames
     */
    sendCommand(cmd: number, data?: Array<any>, useFrames?: boolean): void;
    /**
     * Send multiple commands
     * @param {array<cmds>} array
     * @param {number} mode - The mode to use (NOT USE IT)
     */
    sendArrayRequests(array: Array<any>, mode?: any): void;
    Stop(yes?: boolean): void;
    getMapArraySendColors(UseLastColors?: boolean): any[];
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
    setColorLed(x: number, y: number, r?: number, g?: number, b?: number, brightness?: number, update?: boolean, data?: Array<any>): any[];
    /**
     * Set the color of all LEDs
     * @param r
     * @param g
     * @param b
     * @param brightness
     */
    setColor(r?: number, g?: number, b?: number, brightness?: number): void;
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
    snake(r?: number, g?: number, b?: number, brightness?: number, back?: boolean, led?: number, speed?: number): boolean;
    stopSnake(): void;
    /**
     * Blink all LEDs
     * @param {number} speed - The speed of blink
     */
    blink(speed?: number): void;
    rainbow(speed?: number, w?: number, h?: number, r?: number, g?: number, b?: number): boolean;
    /**
     * Stop blinking
     */
    stopAnimations(): void;
    /**
     * Make a Cross Mark
     * @param {number} r - The red value
     * @param {number} g - The green value
     * @param {number} b - The blue value
     * @param {number} brightness - The brightness value
     **/
    crossMark(r?: number, g?: number, b?: number, brightness?: number, speed?: number): void;
    /**
     * Make a validation mark
     * @param {number} r - The red value
     * @param {number} g - The green value
     * @param {number} b - The blue value
     * @param {number} brightness - The brightness value
     **/
    validMark(r?: number, g?: number, b?: number, brightness?: number, speed?: number): void;
}
export { RGB_pimoroni };
/**
 * @typedef cmds
 * @param {number} cmd - The command name
 * @param {array} data - The array of data
 */ 
