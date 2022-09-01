const { ipcRenderer } = require("electron");

const runProcedure = procId => {
    ipcRenderer.send("runProcedure", procId);
};

window.onload = () => {
    ipcRenderer.send("windowLoaded");
};

ipcRenderer.on("loadAvailableProcedures", (event, data) => {
    data.forEach(procedure => {
        var trElement = document.createElement("tr");

        trElement.innerHTML = `
            <td>${procedure.name}</td>
            <td><button onclick="runProcedure(${procedure.executionId})">Run Procedure</button></td>
        `;

        document.getElementById("procedureList")
            .appendChild(trElement);
    });
});