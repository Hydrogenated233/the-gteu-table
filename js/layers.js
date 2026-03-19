const deciamlZero = new Decimal(0)
function formatEU(x){
    let V=x.div(32).log(4).floor()
    let Vs=["LV","MV","HV","EV","IV","LuV","ZPM","UV","UHV","UEV","UIV","UMV","UXV","MAX"]
    return `${
            V.gte(14)?
            format(x.div(new Decimal(4).pow(V).mul(32)))+"A MAX+"+format(V.sub(15),0):
            format(x.div(new Decimal(4).pow(V).mul(32)))+"A "+Vs[parseInt(format(V))]
        }`
}
function formatSec(basic,zeroCond){
    if(zeroCond)return `(+0.00/s)`
    if(basic.lt(0))return`(${format(basic)}/s)`
    return `(+${format(basic)}/s)`
}
function customPreTcik(diff){//特殊被动(不是获得重置时获得的),passivegain太难写了
    //铝锭
    if(player.points.gte(buyableEffect("s",12))){
        player.a.points=player.a.points
                        .add(
                            decimalOne.mul(hasUpgrade("a",11)?2:1)
                            .mul(0.2)
                            .mul(getBuyableAmount("s", 12))
                            .mul(diff)
        )
    }
    //原油
    if(player.points.gt(buyableEffect("a",12))){
        player.ro.points=player.ro.points
                        .add(
                            getBuyableAmount("a", 12)
                            .sub(hasUpgrade("a", 15)?upgradeEffect('a',15):0)
                            .mul(diff)
                        )
    }
    //燃油
    if(player.fu.points.gte(0)){
    player.fu.points=player.fu.points
                        .add(
                            deciamlZero
                            .sub(getBuyableAmount("fu", 11))
                            .add(hasUpgrade("a", 15)?upgradeEffect('a',15):0)
                            .mul(hasUpgrade("a", 14)?upgradeEffect("a",14):1)
                            .mul(diff)
                        )
    }
}
addLayer("stats", {
    name: "stats",
    position: -99,
    row: 0,
    symbol() { return '统计信息' }, // This appears on the layer's node. Default is the id with the first letter capitalized
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),// This currently does nothing, but it's required. (Might change later if you add mechanics to this layer.)
        }
    },
    color: "rgb(230, 230, 236)",
    type: "none",
    tooltip() { return false },
    layerShown() { return layerDisplayTotal(['stats']) },// If any layer in the array is unlocked, it will returns true. Otherwise it will return false.
    tabFormat: [
        ["display-text", function () { return getPointsDisplay() }],
        ["display-text", function () { return `<br>你现在有${format(player.points)}EU,也就是${formatEU(player.points)}`}],
        ["display-text", function () { return `<br>你最高有${format(player.maxPoints)}EU,也就是${formatEU(player.maxPoints)}`}],
        ["display-text", function () { return `<br>你总共有${format(player.totalPoints)}EU,也就是${formatEU(player.totalPoints)}`}]
    ],
    automate(){
        player.maxPoints = player.maxPoints.max(player.points)
    },
    doReset(){
        layerDataReset('stats', [points])
    }
})
addLayer("1layer", {
    name: "sideLayer1",
    position: -1,
    row: 1,
    symbol() { return '↓ LV ↓' }, // This appears on the layer's node. Default is the id with the first letter capitalized
    small: true,// Set to true to generate a slightly smaller layer node
    nodeStyle: { "font-size": "15px", "height": "30px" },// Style for the layer button
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),// This currently does nothing, but it's required. (Might change later if you add mechanics to this layer.)
        }
    },
    color: "#fefefe",
    type: "none",
    tooltip() { return false },
    layerShown() { return layerDisplayTotal(['1layer']) },// If any layer in the array is unlocked, it will returns true. Otherwise it will return false.
    tabFormat: [
        ["display-text", function () { return getPointsDisplay() }]
    ],
})

addLayer("s", {
    layerShown() { return layerDisplayTotal(['s']) },
    startData() {
        return {                  // startData is a function that returns default data for a layer. 
            unlocked: true,                     // You can add more variables here to add them to your layer.
            points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        }
    },
    name: "steel",
    color: "#8b8b8b",                       // The color for this layer, which affects many elements.
    resource: "钢锭",            // The name of this layer's main prestige resource.
    symbol: "钢锭",
    row: 1,                                 // The row this layer is on (0 is the first row).
    position: 0,
    baseResource: "EU",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(32),              // The amount of the base needed to  gain 1 of the prestige currency.
    // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.6,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    layerShown() { return true },          // Returns a bool for if this layer's node should be visible in the tree.
    microtabs: {
        tab: {
            "upgs":{
                name() { return '升级' }, // Name of tab button
                content: [
                    ['upgrades', 11],
                ],
            },
            "buyables": {
                name() { return '购买项' }, // Name of tab button
                content: [
                    ['buyables', 11],
                ],
            },
        },
    },
    tabFormat: [
        ["display-text", function () { return getPointsDisplay() }],
        "main-display",
        "prestige-button",
        "blank",
        ["microtabs", "tab"],
        ["display-text", function () { return `欢迎来到GTEU增量表!<br>这是一个由格雷科技及其整合包<del>GTNH</del>改编的游戏` }]
    ],
    buyables: {
        11: {
            cost(x) { return new Decimal(1).mul(x.add(1)).pow(2.3) },
            display() { 
                return `基础蒸汽轮机
                +32EU/s
                价格: ${format(this.cost())}钢锭
                目前:+${format(getBuyableAmount(this.layer, this.id).mul(32))}EU/t`;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(){
                return getBuyableAmount(this.layer, this.id).mul(32)
            }
        },
        12: {
            cost(x) {
                return new Decimal(20).mul(x.add(1)).pow(1.3)//基础值
                                        .mul(hasUpgrade('a',13)?upgradeEffect('a',13):1);
            },
            display() {
                return `工业高炉-铝
                -128EU/s但每5秒获得1个铝锭
                价格: ${format(this.cost())}钢锭
                目前:-${format(this.effect())}EU/t
                +${format(getBuyableAmount(this.layer, this.id).mul(0.2))}铝锭/s`;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(){
                return getBuyableAmount(this.layer, this.id).mul(128)
            }
        }
    },
    upgrades: {
        11: {
            title: "改良热机",
            description: "基础蒸汽轮机效果+20%",
            cost: new Decimal(20),
            effect() { return new Decimal(1.2) },
            effectDisplay() { return "+20%" },
            unlocked() { return true },
        },
    },
    passiveGeneration(){
        return 0+(hasUpgrade("a",12)?1:0);
    }
})

addLayer("2layer", {
    name: "sideLayer2",
    position: -1,
    row: 2,
    symbol() { return '↓ MV ↓' }, // This appears on the layer's node. Default is the id with the first letter capitalized
    small: true,// Set to true to generate a slightly smaller layer node
    nodeStyle: { "font-size": "15px", "height": "30px" },// Style for the layer button
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),// This currently does nothing, but it's required. (Might change later if you add mechanics to this layer.)
        }
    },
    color: "#fefefe",
    type: "none",
    tooltip() { return false },
    layerShown() { return layerDisplayTotal(['2layer']) },// If any layer in the array is unlocked, it will returns true. Otherwise it will return false.
    tabFormat: [
        ["display-text", function () { return getPointsDisplay() }]
    ],
})

addLayer("a", {
    layerShown() { return layerDisplayTotal(['a']) },
    startData() {
        return {                  // startData is a function that returns default data for a layer. 
            unlocked: true,                     // You can add more variables here to add them to your layer.
            points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        }
    },
    color: "#227198",                       // The color for this layer, which affects many elements.
    resource: "铝锭",            // The name of this layer's main prestige resource.
    symbol: "铝锭",
    row: 2,                                 // The row this layer is on (0 is the first row).
    position: 0,
    baseResource: "ebf-a",                 // The name of the resource your prestige gain is based on.
    layerShown() { return true },          // Returns a bool for if this layer's node should be visible in the tree.
    microtabs: {
        tab: {
            "upgs":{
                name() { return '升级' }, // Name of tab button
                content: [
                    ['upgrades', 11],
                    ["display-text", function () { return `这些升级太贵了?多建造一些工业高炉` }],
                ],
            },
            "buyables": {
                name() { return '购买项' }, // Name of tab button
                content: [
                    ['buyables', 11],
                ],
            },
        },
    },
    tabFormat: [
        ["display-text", function () { return getPointsDisplay() }],
        "main-display",
        ["display-text", function () { 
            return formatSec(
                decimalOne.mul(hasUpgrade("a",11)?2:1).mul(0.2).mul(getBuyableAmount("s", 12))
                ,player.points.lte(buyableEffect("s",12))
            )
        }],
        "blank",
        ["microtabs", "tab"],
    ],
    buyables: {
        11: {
            cost(x) { return new Decimal(1).mul(x.add(1)).pow(2.4) },
            display() { 
                return `进阶蒸汽轮机
                +128EU/s
                价格: ${format(this.cost())}铝锭
                目前:+${format(getBuyableAmount(this.layer, this.id).mul(128))}EU/t`;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(){
                return getBuyableAmount(this.layer, this.id).mul(128)
            }
        },
        12: {
            cost(x) { return new Decimal(10).mul(x.add(1)).pow(1.4) },
            display() {
                return `泵
                -原油-128EU/s
                +1B原油/s
                价格: ${format(this.cost())}铝锭
                目前:-${format(getBuyableAmount(this.layer, this.id).mul(128))}EU/t
                +${format(getBuyableAmount(this.layer, this.id).mul(1))}B原油/s`;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(){
                return [getBuyableAmount(this.layer, this.id).mul(1),getBuyableAmount(this.layer, this.id).mul(128)]
            }
        },
    },

    upgrades: {
        11:{
            title: "升压-工业高炉-铝",
            description: `工业高炉-铝速度*2<br>
            能耗*4<br>
            注意你的发电量`,
            cost: new Decimal(20),
            effect() { return [new Decimal(2),new Decimal(4)] },
            unlocked() { return true },
        },
        12:{
            title: "被动钢产线",
            description: `每秒获得100%重置时可获得的钢锭`,
            cost: new Decimal(30),
            effect() { return 1 },
            unlocked() { return true },
        },
        13:{
            title: "结构共用",
            description: `工业高炉-铝价格-70%
            是不是很棒?`,
            cost: new Decimal(50),
            effect() { return 0.7 },
            unlocked() { return true },
        },
        14:{
            title: "省油策略",
            description: `进阶内燃机油耗-50%`,
            cost: new Decimal(80),
            effect() { return 0.5 },
            unlocked() { return true },
        },
        15:{
            title: "被动燃油产线",
            description: `+10燃油/s
            -10原油/s
            -1280EU/s`,
            cost: new Decimal(130),
            effect() { return new Decimal(10) },
            unlocked() { return true },
        }
    },
})

addLayer("ro", {
    layerShown() { return layerDisplayTotal(['ro']) },
    startData() {
        return {                  // startData is a function that returns default data for a layer. 
            unlocked: true,                     // You can add more variables here to add them to your layer.
            points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        }
    },

    color: "#424242",                       // The color for this layer, which affects many elements.
    resource: "原油",            // The name of this layer's main prestige resource.
    symbol: "原油",
    row: 2,                                 // The row this layer is on (0 is the first row).
    position: 1,
    baseResource: "oil-pump",                 // The name of the resource your prestige gain is based on.
    layerShown() { return true },          // Returns a bool for if this layer's node should be visible in the tree.
    microtabs: {
        tab: {
            "buyables": {
                name() { return '购买项' }, // Name of tab button
                content: [
                    ['buyables', 11],
                ],
            },
        },
    },
    tabFormat: [
        ["display-text", function () { return getPointsDisplay() }],
        "main-display",
        ["display-text", function () {//记得改customPreTick
            return formatSec(getBuyableAmount("a", 12)
                            .sub(hasUpgrade("a", 15)?upgradeEffect('a',15):0),
                            player.points.lte(buyableEffect("a",12)))
        }],
        "blank",
        ["microtabs", "tab"]
    ],
    buyables: {
        11: {
            cost(x) { return new Decimal(1) },
            display() { 
                return `精炼原油-燃油
                -1原油
                +1燃油
                价格: ${format(this.cost())}铝锭
                `
            },
            canAfford() { return player.a.points.gte(this.cost())&player[this.layer].points.gte(1)},
            buy() {
                player.a.points = player.a.points.sub(this.cost())
                player.fu.points = player.fu.points.add(1)
                player[this.layer].points = player[this.layer].points.sub(1)
            },
            effect(){
                return getBuyableAmount(this.layer, this.id).mul(128)
            }
        },
    },
})
addLayer("fu", {
    layerShown() { return layerDisplayTotal(['fu']) },
    startData() {
        return {                  // startData is a function that returns default data for a layer. 
            unlocked: true,                     // You can add more variables here to add them to your layer.
            points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        }
    },
    color: "#dfff4f",                       // The color for this layer, which affects many elements.
    resource: "燃油",            // The name of this layer's main prestige resource.
    symbol: "燃油",
    row: 2,                                 // The row this layer is on (0 is the first row).
    position: 2,
    baseResource: "oil",                 // The name of the resource your prestige gain is based on.
    layerShown() { return true },          // Returns a bool for if this layer's node should be visible in the tree.
    microtabs: {
        tab: {
            "buyables": {
                name() { return '购买项' }, // Name of tab button
                content: [
                    ['buyables', 11],
                ],
            },
        },
    },
    tabFormat: [
        ["display-text", function () { return getPointsDisplay() }],
        "main-display",
        ["display-text", function () { return "昂贵但高效的燃料" }],
        ["display-text", function () { return `距离耗空还有${
            format(player.fu.points.div(//记得改customPreTick
                getBuyableAmount("fu", 11)
                                    .sub(hasUpgrade("a", 15)?upgradeEffect('a',15):0)
                                    .mul(hasUpgrade("a", 14)?upgradeEffect("a",14):1)
            ))
        }s` }],
        "blank",
        ["microtabs", "tab"]
        
    ],
    buyables: {
        11: {
            cost(x) { return new Decimal(30).pow(x.div(10).add(1)) },
            display() { 
                return `进阶内燃机
                -1燃油/s
                +1280EU/s
                目前:+${format(getBuyableAmount(this.layer, this.id).mul(1280))}EU/t
                价格: ${format(this.cost())}铝锭
                `
            },
            canAfford() { return player.a.points.gte(this.cost()) },
            buy() {
                player.a.points = player.a.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(){
                return getBuyableAmount(this.layer, this.id).mul(1280)
            }
        },
    },


})