module.exports = (toolbox) => {
    const { prompt: { ask } } = toolbox;

    async function askPatch(target) {
        const askPatch = {
            type: 'list',
            name: 'patch',
            message: `Do you want to add import to file ${target}?`,
            choices: ['yes', 'no'],
        }
        const questions = [askPatch];
        const { patch } = await ask(questions)

        return patch === 'yes' ? true : false
    }

    toolbox.askPatch = askPatch;
}