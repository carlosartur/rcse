const { exec } = require('child_process');

class Command {
    /** @type {String} */
    name = null;

    /** @type {String} */
    command = null;

    /** @type {String} */
    #executionId = "";

    /**
     * @param {Object} info 
     */
    constructor(info) {
        Object.assign(this, info);

        if (!this.name) {
            throw new Error("The name of command must be provided");
        }

        if (!this.command) {
            throw new Error("The shell line of command must be provided");
        }

        this.buildExecutionId();
    }

    get executionId() {
        return this.#executionId;
    }

    /**
     * @method buildExecutionId Build execution id info.
     */
    buildExecutionId() {
        let slug = this.name
            .toLowerCase()
            .replace(/\W/g, "-");
        
        this.#executionId = `${slug}${Math.random().toString(36).substring(2)}`;
    }

    /**
     * @method run Execute command on operating system.
     * @returns {Promise}
     */
    run() {
        return new Promise((resolve, reject) => {
            exec(this.command, (err, output) => {
                if (err) {
                    reject(`Could not execute command: ${err}`);
                    return;
                }
                resolve(`Output: ${output}`);
            });
        });
    }
}

module.exports = Command;