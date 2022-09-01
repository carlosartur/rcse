const Command = require("./Command");

class Procedure {
    /** @type {String} */
    name = null;

    /** @type {Command[]} */
    commands = [];

    /** @type {Number}  */
    executionId = 0;

    constructor(info) {
        this.name = info.name;

        info.commands.forEach(element => {
            this.commands.push(new Command(element));
        });

        this.executionId = Math.random().toString(10).substring(2);
    }
}

module.exports = Procedure