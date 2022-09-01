const { ipcRenderer } = require("electron");

ipcRenderer.on("executingProcedure", (event, title) => {
    document.title = title;
});

ipcRenderer.on("executingCommand", (event, data) => {
    let pNode = document.createElement("p");
    pNode.innerHTML = data;

    document.getElementById("commandOutput")
        .appendChild(pNode);
});