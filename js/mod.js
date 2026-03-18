let modInfo = {
	name: "The GTEU Table",
	nameI18N: "The GTEU Table",// When you enabled the internationalizationMod, this is the name in the second language
	id: "gteu",
	author: "环三氧杂四氢",
	pointsName: "EU",
	modFiles: ["layers.js", "tree.js"],

	internationalizationMod: false,
	// When enabled, it will ask the player to choose a language at the beginning of the game
	changedDefaultLanguage: true,
	// Changes the mod default language. false -> English, true -> Chinese

	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 999,  // In hours
}

var colors = {
	button: {
		width: '250px',// Table Button
		height: '40px',// Table Button
		font: '25px',// Table Button
		border: '3px'// Table Button
	},
	default: {
		1: "#ffffff",//Branch color 1
		2: "#bfbfbf",//Branch color 2
		3: "#7f7f7f",//Branch color 3
		color: "#dfdfdf",
		points: "#ffffff",
		locked: "#bf8f8f",
		background: "#0f0f0f",
		background_tooltip: "rgba(0, 0, 0, 0.75)",
	},
}

// When enabled, it will hidden left table
function hiddenLeftTable(){
	return false
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "Literally nothing",
}

function changelog(){
	return i18n(`
		<br><br><br><h1>更新日志:</h1><br>(不存在<span style='color: red'><s>剧透警告</s></span>)<br><br>
		<span style="font-size: 17px;">
			<h3>v0.0</h3><br>
				- 钢和铝<br>
			<br><br>
		`, `
		<br><br><br><h1>ChangeLog:</h1><br>(No<span style='color: red'><s> Spoiler Warning!</s></span>)<br><br>
		<span style="font-size: 17px;">
			<h3><s>YOU SHOULD WRITE THIS YOURSELF</s></h3><br><br>
			<h3>v3.0 - Unprecedented changes</h3><br>
				- Developed The Modding Table, Which, you could say, is another form of TMT<br>
			<br><br>
	`, false)
} 

function winText(){
	return i18n(`你暂时完成了游戏!`, `Congratulations! You have reached the end and beaten this game, but for now...`, false)
}

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	//==LV===
	//基础蒸气轮机
	gain=gain
				.add(buyableEffect("s", 11))//基础
				.mul(hasUpgrade("s", 11)?upgradeEffect("s", 11):1)//热机改良
	//工业高炉-铝
	gain=gain
				.sub(
					buyableEffect("s", 12)
					.mul(hasUpgrade("a",11)?4:1)//超频
				)
				
	//==MV==
	//进阶蒸气轮机
	gain=gain
				.add(buyableEffect("a", 11))//基础
	//泵-原油
	gain=gain
				.sub(
					buyableEffect("a", 12)[2]
				)
	//进阶内燃机
	if(player.fu.points.gt(0)){
		gain=gain.
				add(getBuyableAmount("fu", 11).mul(1280))
	}
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra information at the top of the page
var displayThings = [
	function() {
		if(options.ch==undefined && modInfo.internationalizationMod==true){return '<big><br>You should choose your language first<br>你需要先选择语言</big>'}
		return '<div class="res">'+displayThingsRes()+'</div><br><div class="vl2"></div></span>'
	}
]

// You can write code here to easily display information in the top-left corner
function displayThingsRes(){
	return 'EUs: '+format(player.points)+' | '
}

// Determines when the game "ends"
function isEndgame() {
	return false
}

function getPointsDisplay(){
	let a = ''
	if(player.devSpeed && player.devSpeed!=1){
		a += options.ch ? '<br>时间加速: '+format(player.devSpeed)+'x' : '<br>Dev Speed: '+format(player.devSpeed)+'x'
	}
	if(player.offTime!==undefined){
		a += options.ch ? '<br>离线加速剩余时间: '+formatTime(player.offTime.remain) : '<br>Offline Time: '+formatTime(player.offTime.remain)
	}
	a += '<br>'
	if(!(options.ch==undefined && modInfo.internationalizationMod==true)){
		a += `<span class="overlayThing">${(i18n("你有", "You have", false))} <h2 class="overlayThing" id="points"> ${format(player.points)}</h2> ${i18n(modInfo.pointsName, modInfo.pointsNameI18N)}</span>`
		if(canGenPoints()){
			a += `<br><span class="overlayThing">(`+(tmp.other.oompsMag != 0 ? format(tmp.other.oomps) + " OoM" + (tmp.other.oompsMag < 0 ? "^OoM" : tmp.other.oompsMag > 1 ? "^" + tmp.other.oompsMag : "") + "s" : formatSmall(getPointGen()))+`/sec)</span>`
		}
		a += `<div style="margin-top: 3px"></div>`
	}
	a += tmp.displayThings
	a += '<br><br>'
	return a
}

// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
