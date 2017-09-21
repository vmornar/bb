var host = location.host;
if (host.indexOf(":9003") < 0) host += ":9003";
var ws;
var values;
var column;
var myModal;
var ctx = "myChart";
var data = {};
var canvas;

function showValue(o) {
	if (o.widget == "span") {
		document.getElementById(o.id).innerHTML = o.value;
	} else {
		document.getElementById(o.id).checked = o.value == 1 ? true : false;
	}
}

function unselect() {
	$('[id^=C]').prop('checked', false);
}

function send(id) {
	ws.send(JSON.stringify({
		command: 'set',
		id: id,
		value: document.getElementById(id).checked ? 1 : 0
	}));
}

function closeModal() {
	myModal.style.display = "none";
}

function drawTemps() {
	$("[id^=C]").prop("checked", false);
	$("[id^=C]").promise().done(function () {
		$("#C62,#C63,#C65,#C66,#C115").prop("checked", true);
		draw();
	});
}

function drawPumps() {
	$("[id^=C]").prop("checked", false);
	$("[id^=C]").promise().done(function () {
		$("#C31,#C32,#C33,#C34").prop("checked", true);
		draw();
	});
}

function draw() {
	myModal = document.getElementById("myModal");
	myModal.style.display = "block";
	var vfromDate = $("#fromDate").val();
	var vtoDate = $("#toDate").val();
	canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
	column = 0;
	data.datasets = [];

	//$("input:checked").each(function () {
	$("[id^=C]:checked").each(function () {
		if (this.id.startsWith("C")) {
			var o = things.findById(this.id.substring(1));
			//console.log(o.steppedLine, o.graphOffset == undefined ? 1 : o.graphOffset);
			data.datasets.push({
				label: o.name,
				data: [],
				pointRadius: 0,
				fill: false,
				borderWidth: 1,
				borderColor: o.graphColor,
				deviceId: o.id,
				offset: o.graphOffset == undefined ? 1 : o.graphOffset,
				steppedLine: o.steppedLine
			});
			$.post("data", {
					id: o.id,
					fromDate: vfromDate,
					toDate: vtoDate,
					column: column,
					source: $("#sql").prop("checked") == true ? "sql" : "mongo"
				})
				.done(function (result) {
					for (i = 0; i < result.data.length; i++) {
						//console.log(result.data[i].time, Number(result.data[i].value));
						data.datasets[result.column].data.push({
							x: result.data[i].time,
							y: Number(result.data[i].value) * data.datasets[result.column].offset
						});
						//values.push([result.column, result.data[i].time, Number(result.data[i].value)]);
					};
				});
			column++;
		}
	});
}

$(document).ajaxStop(function () {
	chartInstance = new Chart(ctx, {
		type: "line",
		data: data,
		options: {
			scales: {
				xAxes: [{
					type: 'time', // linear
					position: 'bottom',
					ticks: {
						maxRotation: 90
					},
					time: {
						displayFormats: {
							hour: 'YY/MM/DD hh'
						}
					}
				}]
			}
		}
	});
});

function sqlClicked() {
	localStorage.setItem("sqlChecked", $("#sql").prop("checked"));
}

initLib();

$(document).ready(function () {
	canvas = $("#myChart")[0];
	vfromDate = new Date();
	vfromDate.setDate(vfromDate.getDate() - 1);
	document.getElementById('fromDate').defaultValue = vfromDate.toDateInputValue();
	document.getElementById('toDate').defaultValue = new Date().toDateInputValue();
	for (var i = 0; i < things.length; i++) {
		if (things[i].iface != null) {
			var html = "<tr><td>" + things[i].name
			if (things[i].icon != null) {
				html += "<i class = 'right mdi mdi-" + things[i].icon + "'>"
			}
			html += "</td>";
			if (things[i].type == "Ipin" || things[i].type == "espIpin") {
				html += "<td class='middle'><input id='" + things[i].id + "' type = 'checkbox' disabled = true class='" + things[i].widget + "'/><label for='" + things[i].id + "'></label></td>"
			} else if (things[i].type == "IOpin" || things[i].type == "espIOpin") {
				html += "<td class='middle'><input id='" + things[i].id + "' type = 'checkbox' onchange = 'send(this.id)' class='" + things[i].widget + "'/><label for='" + things[i].id + "'></label></td>"
			} else {
				html += "<td class='middle'><span id='" + things[i].id + "'></span></td>"
			}
			html += "<td class='middle'><input id='C" + things[i].id + "' type = 'checkbox' class='checkbox-custom chart-line'/><label for='C" + things[i].id + "'></label></td>"
			$("#" + things[i].iface).append(html);
		}
	}

	var chk = localStorage.getItem("sqlChecked");
	$("#sql").prop("checked", chk == 'true' ? true : false);
	ws = new WebSocket("wss://" + host + '/scadasocket');
	ws.onmessage = function (msg) {
		let cmd = JSON.parse(msg.data);
		console.log(cmd);
		if (cmd.param == 'switchlight') {
			document.getElementById(cmd.idx).innerHTML = cmd.switchcmd;
		} else if (cmd.param == 'udevice') {

			var o = things.findById(cmd.idx);
			if (o != null) {
				o.value = cmd.svalue;
				showValue(o);
			}
		}
	}
});