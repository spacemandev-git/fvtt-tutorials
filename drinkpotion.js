main()

async function main(){
  console.log("Hello World")
  //Is a token selected? If not, error
  console.log("Tokens: ", canvas.tokens.controlled)
  if(canvas.tokens.controlled.length == 0 || canvas.tokens.controlled.length > 1){
    ui.notifications.error("Please select a single token");
    return;
  }
  let actor = canvas.tokens.controlled[0].actor

  //Does the token have a health potion? Otherwise error
  console.log("Actor: ", actor);
  let healthpotion = actor.items.find(item => item.data.name == "Health Potion")
  if(healthpotion == null || healthpotion == undefined){
    ui.notifications.error("No Health Potions left");
    return;
  }
  
  //If token is max health if so, don't do anything
  if(actor.data.data.health.value == actor.data.data.health.max){
    ui.notifications.error("Actor already at max health");
    return;
  }

  //Subtract a health potion
  await healthpotion.update({"data.quantity": healthpotion.data.data.quantity - 1})
  if(healthpotion.data.data.quantity < 1){
    healthpotion.delete();
  }
  
  //Increase token health

  //// New Health is going to be grater the max health
  ////// If so, we want the new health to max 
  let newHealth = actor.data.data.health.value + healthpotion.data.data.attributes.hp_restore.value
  if(newHealth > actor.data.data.health.max){
    newHealth = actor.data.data.health.max
  }

  //update the actor health
  await actor.update({"data.health.value": newHealth});
  ui.notifications.info(`${actor.data.name} drank a health potion`)
}