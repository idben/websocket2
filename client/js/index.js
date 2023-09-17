const ws = new WebSocket("ws://localhost:8080");
const userId = new Date().getTime().toString();
let clientList;


ws.addEventListener("open", () => {
  console.log("新的使用者已連線");
  let prarms = {
    type: "register",
    userId: userId
  }
  ws.send(JSON.stringify(prarms));
});

ws.addEventListener("message", async (event) => {
  let resutlt = JSON.parse(event.data);
  if(resutlt.type === "registered"){
    clientList = resutlt.otherClients;
    setClientList();
  }
  if(resutlt.type === "disconnected"){
    clientList = resutlt.otherClients;
    setClientList();
  }
});


function setClientList(){
  console.log(clientList)
  let clientDOM = "<div>"
  clientList.forEach(client=>{
    let myself = (client === userId) ? "myself" :"";
    clientDOM += `<div class="${myself}">${client}</div>`
  });
  clientDOM += "</div>"
  document.querySelector("body").innerHTML = clientDOM;
}


