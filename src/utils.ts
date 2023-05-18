module.exports = {
	FRAMES_REGISTER: 1, // Exec multiple commands with a check at the end (check init with cmd: MODE_REGISTER)
	GAIN_REGISTER: 11, // Exec 1 command without check
	FRAMES_CHECK: 0, // Check commands
	FRAME_EDIT: 253, // Edit frame

	ledsNumber: 5*5,

	LEDS_MAP: {
		36: 32,
		68: 32,
		100: 32,
		132: 32,
		164: 16,
	},

	LEDS_5X5_MAP_BY_ROW: [
		[0, 1, 2, 3, 4],
		[9, 8, 7, 6, 5],
		[10, 11, 12, 13, 14],
		[19, 18, 17, 16, 15],
		[20, 21, 22, 23, 24],
	]
}