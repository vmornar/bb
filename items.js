var boxes = [{
		id: 0,
		name: "Heating",
		ip: "192.160.0.11",
		port: 8001
	},
	{
		id: 1,
		name: "ESP1",
		ip: "192.168.0.25"
	},
	{
		id: 2,
		name: "Bridge",
		ip: "192.168.0.19",
		port: 7474,
		mac: "b4:43:0d:38:b0:46"
	},
	{
		id: 3,
		name: "ESP",
		ip: "192.168.0.24"
	}

]

var things = [
	// Grijanje
	{
		id: 21,
		type: "IOpin",
		boxid: 0,
		pin: 21,
		name: "Kolektori booster",
		iface: "tGrijanje",
		widget: "checkbox-custom power",
		graphColor: "Turquoise",
		graphOffset: 3,
		steppedLine: true
	},
	{
		id: 22,
		type: "IOpin",
		boxid: 0,
		pin: 22,
		name: "Kolektori",
		iface: "tGrijanje",
		widget: "checkbox-custom power",
		graphColor: "Aquamarine",
		graphOffset: 6,
		steppedLine: true
	},
	{
		id: 23,
		type: "IOpin",
		boxid: 0,
		pin: 23,
		name: "Recirkulacija",
		iface: "tGrijanje",
		widget: "checkbox-custom power",
		graphColor: "FireBrick",
		graphOffset: 9,
		steppedLine: true
	},
	{
		id: 24,
		type: "IOpin",
		boxid: 0,
		pin: 24,
		name: "Izmjenjivač",
		iface: "tGrijanje",
		widget: "checkbox-custom power",
		graphColor: "Gold",
		graphOffset: 12,
		steppedLine: true
	},
	{
		id: 25,
		type: "IOpin",
		boxid: 0,
		pin: 25,
		name: "(ne radi)"
	},
	{
		id: 26,
		type: "IOpin",
		boxid: 0,
		pin: 26,
		name: "Relej bojlera",
		iface: "tGrijanje",
		widget: "checkbox-custom power",
		steppedLine: true
	},
	{
		id: 27,
		type: "IOpin",
		boxid: 0,
		pin: 27,
		name: "Radijatori",
		iface: "tGrijanje",
		widget: "checkbox-custom power",
		graphColor: "Sienna",
		graphOffset: 15,
		steppedLine: true
	},
	{
		id: 28,
		type: "IOpin",
		boxid: 0,
		pin: 28,
		name: "Ventil",
		iface: "tGrijanje",
		widget: "checkbox-custom power",
		graphColor: "DarkRed",
		graphOffset: 18,
		steppedLine: true
	},
	{
		id: 34,
		type: "Ipin",
		boxid: 0,
		pin: 34,
		name: "Pumpa suteren",
		iface: "tGrijanje",
		widget: "checkbox-custom led",
		graphColor: "PaleVioletRed",
		graphOffset: 21,
		steppedLine: true
	},
	{
		id: 33,
		type: "Ipin",
		boxid: 0,
		pin: 33,
		name: "Pumpa prizemlje",
		iface: "tGrijanje",
		widget: "checkbox-custom led",
		graphColor: "Pink",
		graphOffset: 24,
		steppedLine: true
	},
	{
		id: 32,
		type: "Ipin",
		boxid: 0,
		pin: 32,
		name: "Pumpa kat",
		iface: "tGrijanje",
		widget: "checkbox-custom led",
		graphColor: "LightSalmon",
		graphOffset: 27,
		steppedLine: true
	},
	{
		id: 31,
		type: "Ipin",
		boxid: 0,
		pin: 31,
		name: "Pumpa potkrovlje",
		iface: "tGrijanje",
		widget: "checkbox-custom led",
		graphColor: "NavajoWhite",
		graphOffset: 30,
		steppedLine: true
	},
	{
		id: 61,
		type: "dallas",
		boxid: 0,
		pin: 2,
		name: "Vanjska temperatura",
		iface: "tGrijanje",
		icon: "thermometer",
		widget: "span",
		graphColor: "Green"
	},
	{
		id: 62,
		type: "dallas",
		boxid: 0,
		pin: 3,
		name: "Spremnik gore",
		iface: "tGrijanje",
		icon: "thermometer",
		widget: "span",
		graphColor: "Red"
	},
	{
		id: 63,
		type: "dallas",
		boxid: 0,
		pin: 3,
		name: "Povrat",
		iface: "tGrijanje",
		icon: "thermometer",
		widget: "span",
		graphColor: "Orange"
	},
	{
		id: 64,
		type: "dallas",
		boxid: 0,
		pin: 3,
		name: "Unutra",
		iface: "tGrijanje",
		icon: "thermometer",
		widget: "span",
		graphColor: "Cyan"
	},
	{
		id: 65,
		type: "dallas",
		boxid: 0,
		pin: 3,
		name: "Spremnik dolje",
		iface: "tGrijanje",
		icon: "thermometer",
		widget: "span",
		graphColor: "Blue"
	},
	{
		id: 66,
		type: "dallas",
		boxid: 0,
		pin: 3,
		name: "Pufer",
		iface: "tGrijanje",
		icon: "thermometer",
		widget: "span",
		graphColor: "SaddleBrown"
	},
	{
		id: 115,
		type: "pt1000",
		boxid: 0,
		pin: 15,
		name: "Kolektori",
		iface: "tGrijanje",
		icon: "thermometer",
		widget: "span",
		graphColor: "Yellow"
	},
	// ESP1
	{
		id: 1012,
		type: "espIpin",
		boxid: 1,
		pin: 12,
		name: "ESP 1 Pin 12",
		iface: "tESP1",
		widget: "checkbox-custom led"
	},
	{
		id: 1014,
		type: "espIOpin",
		boxid: 1,
		pin: 14,
		name: "ESP 1 Pin 14",
		iface: "tESP1",
		widget: "checkbox-custom power"
	},
	{
		id: 1253,
		type: "espvalue",
		boxid: 1,
		name: "Freemem ESP1",
		iface: "tESP1",
		icon: "numeric",
		widget: "span"
	},
	{
		id: 1254,
		type: "espvalue",
		boxid: 1,
		name: "RSSI ESP1",
		iface: "tESP1",
		icon: "numeric",
		widget: "span"
	},
	{
		id: 1255,
		type: "espvalue",
		boxid: 1,
		name: "Uptime ESP1",
		iface: "tESP1",
		icon: "numeric",
		widget: "span"
	},
	// ESP
	{
		id: 3001,
		type: "espvalue",
		boxid: 3,
		name: "Freemem ESP",
		iface: "tESP",
		icon: "numeric",
		widget: "span"
	},
	{
		id: 3002,
		type: "espvalue",
		boxid: 3,
		name: "RSSI ESP",
		iface: "tESP",
		icon: "numeric",
		widget: "span"
	},
	{
		id: 3003,
		type: "espvalue",
		boxid: 3,
		name: "Uptime ESP",
		iface: "tESP",
		icon: "numeric",
		widget: "span"
	},
	{
		id: 3004,
		type: "espvalue",
		boxid: 3,
		name: "Temp ESP",
		iface: "tESP",
		icon: "numeric",
		widget: "span"
	},
	// Bridge
	{
		id: 2011,
		type: "bridge",
		boxid: 2,
		api_id: 1011,
		name: "Dnevna soba",
		iface: "tBridge",
		icon: "thermometer",
		widget: "span"
	}
];


(function (exports) {
	exports.things = things;
	exports.boxes = boxes;
}(typeof exports === 'undefined' ? this.share = {} : exports));