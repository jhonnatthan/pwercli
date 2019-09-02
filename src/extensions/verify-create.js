module.exports = (toolbox) => {
    const { filesystem: { exists }, prompt: { ask } } = toolbox;

    async function verifyExistsCreate(_target, _message = null) {
        if (!exists(_target)) {
            const askCreate = {
                type: 'list',
                name: 'create',
                message: _message ? _message : `The file ${_target} does not exist, do you want to create it`,
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