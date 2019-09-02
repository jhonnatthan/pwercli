module.exports = (toolbox) => {
    const { filesystem: { exists }, prompt: { ask } } = toolbox;

    async function verifyExistsCreate(target) {
        if (!exists(target)) {
            const askCreate = {
                type: 'list',
                name: 'create',
                message: `The file ${target} does not exist, do you want to create it`,
                choices: ['yes', 'no'],
            }
            const questions = [askCreate];
            const { create } = await ask(questions)

            return create === 'yes' ? true : false
        } else {
            return false;
        }
    };

    toolbox.verifyExistsCreate = verifyExistsCreate;
}