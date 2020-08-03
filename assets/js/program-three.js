/**
 * Create by Xinyu Aug 1, 2020
 */

//values
var coinsBox;
var drawerA;
var tillA;
var tillB;
var todaysCoinsTotal;

var eftposA;
var eftposB;
var todaysEftposTotal;

var noteA;
var noteB;
var todaysNoteTotal;

var yesterdayA;
var yesterdayB;
var yesterdayTotal;

var dailySalesTotal;
var cashUpTotal; //calculate
var difference;

function initiateVariables() {
	coinsBox = 0;
    drawerA = 0;
    tillA = 0;
    tillB = 0;
    todaysCoinsTotal = 0;
    eftposA = 0;
    eftposB = 0;
    todaysEftposTotal = 0;
    noteA = 0;
    noteB = 0;
    todaysNoteTotal = 0;
    yesterdayA = 0;
    yesterdayB = 0;
    yesterdayTotal = 0;
    dailySalesTotal = 0;
    cashUpTotal = 0;
    difference = 0;
}
this.initiateVariables();

// function getInputValues() {
// 	coinsBox = parseFloat(document.getElementById("coinsBox").value);
//     drawerA = document.getElementById("drawerA").value;
//     tillB = document.getElementById("tillB").value;
//     eftposA = document.getElementById("eftposA").value;
//     eftposB = document.getElementById("eftposB").value;
//     noteA = document.getElementById("noteA").value;
//     noteB = document.getElementById("noteB").value;
//     yesterdayA = document.getElementById("yesterdayA").value;
//     yesterdayB = document.getElementById("yesterdayB").value;
//     yesterdayTotal = document.getElementById("yesterdayTotal").value;
//     dailySalesTotal = document.getElementById("dailySalesTotal").value;
// }

function getFloatFromDoc(str) {
	return parseFloat(document.getElementById(str).value);
}

function toTwoDecimal(num) {
	// for checking
	console.log(num);
	 return (Math.round((num + Number.EPSILON) * 100) / 100)
}

function getInputValues() {
  coinsBox = this.getFloatFromDoc("coinsBox");
  drawerA = this.getFloatFromDoc("drawerA");
  tillB = this.getFloatFromDoc("tillB");
  eftposA = this.getFloatFromDoc("eftposA");
  eftposB = this.getFloatFromDoc("eftposB");
  noteA = this.getFloatFromDoc("noteA");
  noteB = this.getFloatFromDoc("noteB");
  yesterdayA = this.getFloatFromDoc("yesterdayA");
  yesterdayB = this.getFloatFromDoc("yesterdayB");
  yesterdayTotal = this.getFloatFromDoc("yesterdayTotal");
  dailySalesTotal = this.getFloatFromDoc("dailySalesTotal");
}

function calculateOutputValues() {
  tillA = this.toTwoDecimal(coinsBox + drawerA);
  todaysCoinsTotal = this.toTwoDecimal(tillA + tillB);
  todaysEftposTotal = this.toTwoDecimal(eftposA + eftposB);
  todaysNoteTotal = this.toTwoDecimal(noteA + noteB);
  cashUpTotal = this.toTwoDecimal(parseFloat(todaysCoinsTotal + todaysEftposTotal + todaysNoteTotal - yesterdayTotal));
  difference = this.toTwoDecimal(parseFloat(cashUpTotal - dailySalesTotal));
}

function setOutputTxt() {
	document.getElementById("tillA").innerHTML = "$ " + tillA;
	document.getElementById("todaysCoinsTotal").innerHTML = "$ " + todaysCoinsTotal;
	document.getElementById("todaysEftposTotal").innerHTML = "$ " + todaysEftposTotal;
	document.getElementById("todaysNoteTotal").innerHTML = "$ " + todaysNoteTotal;
	document.getElementById("cashUpTotal").innerHTML = "$ " + cashUpTotal;
	document.getElementById("difference").innerHTML = "$ " + difference;
}

function resetOutputTXT() {
	document.getElementById("tillA").innerHTML = "$ 0";
	document.getElementById("todaysCoinsTotal").innerHTML = "$ 0";
	document.getElementById("todaysEftposTotal").innerHTML = "$ 0";
	document.getElementById("todaysNoteTotal").innerHTML = "$ 0";
	document.getElementById("cashUpTotal").innerHTML = "$ 0";
	document.getElementById("difference").innerHTML = "$ 0";
}

function checkYesterdayTotal(){

}

function updateTable() {
	getInputValues();
	// checkYesterdayTotal();
	calculateOutputValues();
	setOutputTxt();

	// don't submit and refresh the values
	return false;
}

function resetValues() {
	var r = confirm("Reset all values to 0?");
	if (r == true) {
		this.initiateVariables();
		this.resetOutputTXT();
		document.getElementById("SDForm").reset();
	} else {
	// pressed Cancel
	}
  }