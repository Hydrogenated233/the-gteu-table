addLayer("1layer", {
    name: "sideLayer1",
    position: -1,
    row: 0,
    symbol() { return '↓ layer 1 ↓' }, // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N() { return '↓ layer 1 ↓' }, // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled (in mod.js)
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
    layerShown() { return layerDisplayTotal(['s','a','ro','fu']) },// If any layer in the array is unlocked, it will returns true. Otherwise it will return false.
    tabFormat: [
        ["display-text", function () { return getPointsDisplay() }]
    ],
})

addLayer("s", {
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
    exponent: 0.3,                          // "normal" prestige gain is (currency^exponent).

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
        ["microtabs", "tab"]
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
            cost(x) { return new Decimal(20).mul(x.add(1)).pow(1.5) },
            display() { 
                return `工业高炉-铝
                -128EU/s但每10秒获得1个铝锭
                价格: ${format(this.cost())}钢锭
                目前:-${format(getBuyableAmount(this.layer, this.id).mul(128))}EU/t
                +${format(getBuyableAmount(this.layer, this.id).mul(0.1))}铝锭/s`;
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
        11: {
            title: "",
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
    symbol() { return '↓ layer 2 ↓' }, // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N() { return '↓ layer 2 ↓' }, // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled (in mod.js)
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
    baseAmount() { return getBuyableAmount("s", 12)  },  // A function to return the current amount of baseResource.

    requires: new Decimal(1),              // The amount of the base needed to  gain 1 of the prestige currency.
    // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 1,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {
        let mult=new Decimal(1)                   // Returns your multiplier to your gain of the prestige resource.
        mult=mult.mul(hasUpgrade("a",11)?2:1)
        return mult              // Factor in any bonuses multiplying gain here.
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
        ["display-text", function () { 
            return "("+format(getBuyableAmount("s", 12).mul(0.1).mul(hasUpgrade("a",11)?2:1))+"/sec)"
        }],
        "blank",
        ["microtabs", "tab"]
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
            description: `工业高炉-铝速度*2
            能耗*4
            有损超频😭`,
            cost: new Decimal(40),
            effect() { return [new Decimal(2),new Decimal(4)] },
            unlocked() { return true },
        },
        12:{
            title: "被动钢产线",
            description: `每秒获得100%重置时可获得的钢锭`,
            cost: new Decimal(60),
            effect() { return 1 },
            unlocked() { return true },
        },
        13:{
            title: "省油策略",
            description: `进阶内燃机油耗-50%`,
            cost: new Decimal(600),
            effect() { return 0.5 },
            unlocked() { return true },
        }
    },
    passiveGeneration(){
        return 0.1;
    }
})

addLayer("ro", {
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
    baseAmount() {
        return getBuyableAmount("a", 12);
    },  // A function to return the current amount of baseResource.

    requires: new Decimal(1),              // The amount of the base needed to  gain 1 of the prestige currency.
    // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 1,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {
        let mult=new Decimal(1)                   // Returns your multiplier to your gain of the prestige resource.
        return mult              // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
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
        ["display-text", function () { 
            return "("+format(getBuyableAmount("a", 12).mul(1))+"/sec)"
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
            canAfford() { return player.a.points.gte(this.cost()) },
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

    passiveGeneration(){
        return 1;
    }
})
addLayer("fu", {
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
    baseAmount() { return getBuyableAmount("fu", 11)  },  // A function to return the current amount of baseResource.

    requires: new Decimal(1),              // The amount of the base needed to  gain 1 of the prestige currency.
    // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 1,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {
        let mult=new Decimal(1)                   // Returns your multiplier to your gain of the prestige resource.
        return mult              // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
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

    passiveGeneration(){
        return -1+upgradeEffect("a",13);
    }
})