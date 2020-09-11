main()

async function main(){
  // Get Selected
  let selected = canvas.tokens.controlled;
  if(selected.length > 1){
    ui.notifications.error("Please select only one token")
    return;
  }
  let selected_actor = selected[0].actor;
  // Get Target
  let targets = Array.from(game.user.targets)
  if(targets.length == 0 || targets.length > 1 ){
    ui.notifications.error("Please target one token");
    return;
  }
  let target_actor = targets[0].actor;

  // Select Weapon
  // Why Filter instead of Find?
  let actorWeapons = selected_actor.items.filter(item => item.data.data.attributes.type.value == "weapon")
  let weaponOptions = ""
  for(let item of actorWeapons){
    weaponOptions += `<option value=${item.id}>${item.data.name} | ATK: ${item.data.data.attributes.attack.value}</option>`
  }

  let dialogTemplate = `
  <h1> Pick a weapon </h1>
  <div style="display:flex">
    <div  style="flex:1"><select id="weapon">${weaponOptions}</select></div>
    <span style="flex:1">Mod <input  id="mod" type="number" style="width:50px;float:right" value=0 /></span>
    <span style="flex:1"><input id="ignoreArmor" type="checkbox" checked /></span>
    </div>
  `
  new Dialog({
    title: "Roll Attack", 
    content: dialogTemplate,
    buttons: {
      rollAtk: {
        label: "Roll Attack", 
        callback: (html) => {
          let wepID = html.find("#weapon")[0].value;
          let wep = selected_actor.items.find(item => item.id == wepID)
          let modifier = html.find("#mod")[0].value;
          let ignoreArmor = html.find("#ignoreArmor")[0].checked;
          // Roll Attack
          let newRollString = `1d20 + ${wep.data.data.attributes.attack.value} +${modifier}`
          let roll = new Roll(newRollString).roll();
          // See if Attack is Greater than their armor, if so
          let result = roll.total
          console.log(result)
          // Print Chat with Button to Roll Damage
          let chatTemplate = ""
          let armor = target_actor.data.data.attributes.armor?.value && !ignoreArmor ? target_actor.data.data.attributes.armor?.value : 0;
          if(result > armor){
            chatTemplate = `
            <p> Rolled: ${result} against ${armor} Target Armor </p>
            <p> It was a Hit! </p>
            <p> <button id="rollDamage">Roll Damage</button></p>
            `
          } else {
            chatTemplate = `
            <p> Rolled: ${result} against ${armor} Target Armor </p>
            <p> It was a Miss! </p>
            `          }
          ChatMessage.create({
            speaker: {
              alias: selected_actor.name
            },
            content: chatTemplate,
            roll: roll
          })

          // Roll Damage
          Hooks.once('renderChatMessage', (chatItem, html) => {
            html.find("#rollDamage").click(() => {
              //console.log("Damage Button Clicked")
              let wepDmg = wep.data.data.attributes.damage?.value ? wep.data.data.attributes.damage.value : ""
              new Roll(wepDmg).roll().toMessage();
            })
          })         
        }
      }, 
      close: {
        label: "Close"
      }
    }
  }).render(true)
}
