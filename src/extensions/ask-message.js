module.exports = (toolbox) => {
    const { prompt: { ask } } = toolbox;

    async function askMessage(message) {
        const askMessage = {
            type: 'list',
            name: 'response',
            message,
            choices: ['yes', 'no'],
        }
        const questions = [askMessage];
        const { response } = await ask(questions)

        return response === 'yes' ? true : false
    }

    toolbox.askMessage = askMessage;
}