//main()
rerollLess20()

async function main(){
  // Fetch All Selected Targets
  let actors = canvas.tokens.controlled.map(token => {return token.actor});
  for(let actor of actors){
    let _atk = actor.data.data.attributes.fight.value
    console.log("Atk: ", _atk)
    if(!_atk){_atk = 0}

    console.log("Wep: ", _wep)
    let roll = new Roll("2d20kl + @actorAtk", {actorAtk: _atk}).roll()
    roll.toMessage()
  }
}

async function rerollLess20(){
  // Fetch All Selected Targets
  let actors = canvas.tokens.controlled.map(token => {return token.actor});
  for(let actor of actors){
    let _atk = actor.data.data.attributes.fight.value
    console.log("Atk: ", _atk)
    if(!_atk){_atk = 0}

    console.log("Wep: ", _wep)
    let roll = new Roll("2d20kl + @actorAtk", {actorAtk: _atk}).roll()
    console.log("Roll Parts: ", roll.parts)
    console.log("Roll Result: ", roll.result)
    console.log("Roll Total: ", roll.total)

    if(actor.items.find(item => item.data.name == "Staff")){
      while(roll.total<20){
        roll = roll.reroll(); // Infinite Loop Possibility!
      }  
    }
    roll.toMessage()
  }
}