const { app, BrowserWindow, ipcMain, clipboard } = require("electron");
const fs = require("fs");
const Command = require("./Command");
const Procedure = require("./Procedure");

let win = null;
let procedures = [];

const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: true,
        webPreferences: {
            nodeIntegration: true
        },
    });

    win.loadFile("gui/index.html");
};

const createModal = () => {
    const child = new BrowserWindow({
        parent: win,
        modal: true,
        show: false,
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    
    child.loadFile('./gui/modal.html');

    child.on("closed", () => child.destroy());

    return child;
};

/**
 * @function
 * 
 * @param {BrowserWindow} modal
 * @param {String} message
 */
const modalMessage = (modal, message) => {
    modal.webContents.send('executingCommand', message);
};

app.whenReady().then(createWindow);

ipcMain.on("windowLoaded", (event, data) => {
    fs.readdir("./procedures", (err, files) => { 
        if (err) {
            throw err
        }

        files.forEach(file => {
            if (!file.includes('.json')) {
                return;
            }
            const procedureData = fs.readFileSync(
                `./procedures/${file}`,
                { encoding: 'utf8', flag: 'r' }
            );

            procedures.push(new Procedure(JSON.parse(procedureData)));
        });

        win.webContents.send("loadAvailableProcedures", procedures);
    });
});

ipcMain.on("runProcedure", async (event, procId) => {
    /** @type {Procedure} */
    let procedure = procedures.filter(element => {
            return element.executionId == procId;
        })
        .pop();

    const child = createModal();
    
    child.once('ready-to-show', () => {
        child.show();
    });

    child.webContents.on('did-finish-load', async () => {
        child.webContents.send("executingProcedure", procedure.name);

        for (const key in procedure.commands) {
            try {
                /** @type {Command} */
                const command = procedure.commands[key];

                modalMessage(child, `Running: ${command.name}`);
                modalMessage(child, `Command: ${command.command}`);

                let output = await command.run();
                modalMessage(child, output);
            } catch (error) {
                modalMessage(child, error);
            }
        }
    });
});