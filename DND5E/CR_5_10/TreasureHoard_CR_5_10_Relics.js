// rolls on the rarity table for CR 0-4
async function rarityRoll(){ 
    let rarity = new Roll("1d100");
    await rarity.evaluate();
    // Common =1, Uncommon = 2, Rare = 3 and Very Rare = 4
    if (rarity.total > 1 && rarity.total <= 30) {
        return 1;
    }
    else if (rarity.total >= 31 && rarity.total <= 81){
        return 2;
    }
    else if (rarity.total >= 82 && rarity.total <= 98){
        return 3;
    } 
    else {
        return 4;
    }
    // this is impossible.
    return 0;
}

// set scoped variables
let coins = new Roll("8d10 * 100");
let numMaItems = new Roll("1d3");
let itemRarities = [];
let items = [];
   
// Rolls
await coins.evaluate();
await numMaItems.evaluate();

// Roll for rarity
if (numMaItems.total > 0) {
    for (let index = 0; index < numMaItems.total; index++) {
        itemRarities[index] = await rarityRoll();
    }
    // Lets roll on the appropriate table now.
    for (let itemRarity of itemRarities) {
        switch (itemRarity) {
            case 1:
                let table1 = await fromUuid("Compendium.dnd-dungeon-masters-guide.tables.RollTable.dmgRelicsCommon0");
                let result1 = await table1.roll();
                items.push(result1.results[0].text);
                break;
            case 2:
                let table2 = await fromUuid("Compendium.dnd-dungeon-masters-guide.tables.RollTable.dmgRelicsUncommo");
                let result2 = await table2.roll();
                items.push(result2.results[0].text);
                break;
            case 3:
                let table3 = await fromUuid("Compendium.dnd-dungeon-masters-guide.tables.RollTable.dmgRelicsRare000");
                let result3 = await table3.roll();
                items.push(result3.results[0].text);
                break;
            case 4:
                let table4 = await fromUuid("Compendium.dnd-dungeon-masters-guide.tables.RollTable.dmgRelicsVeryRar");
                let result4 = await table4.roll();
                items.push(result4.results[0].text);
                break;
            default:
                break;
        }
    }
}

//console.log(items);
   
// Create content
// this needs to be set to content
// Need ` to insert data.
let content = `<div><h1>Treasure!</h1><p>You've found [[/award ${coins.total}gp]] of coins`;
if (numMaItems.total > 0){
    content += ` you've also found ${numMaItems.total} magic item(s)!`;
    let list = `<ul>`;
    for (let item of items) {
        list += `<li>${item}</li>`;
    }
    list += `</ul>`;
    content += list;
}

content += `</div>`;
   
ChatMessage.create({content});