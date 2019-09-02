module.exports = (toolbox) => {
    const { filesystem: { exists }, prompt: { ask }, print: { error } } = toolbox;

    async function verifyExistsOverwrite(target) {
        if (exists(target)) {
            error(`File ${target} exists`);
            const askOverwrite = {
                type: 'list',
                name: 'overwrite',
                message: 'Do you want to overwrite or file?',
                choices: ['yes', 'no'],
            }
            const questions = [askOverwrite];
            const { overwrite } = await ask(questions)

            return overwrite === 'yes' ? true : false
        } else {
            return true
        }
    };

    toolbox.verifyExistsOverwrite = verifyExistsOverwrite;
}