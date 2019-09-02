let generateModule = {
    name: 'generate',
    alias: ['g'],
    run: async toolbox => {
        generateModule.toolbox = toolbox;

        const {
            parameters,
            print: { info, error },
            prompt: { ask },
            createDuck
        } = toolbox;

        let type = parameters.first;
        let name = parameters.second;

        if (!type) {
            let hasName = ['duck', 'sagas', 'component', 'page'];

            const askType = {
                type: 'list',
                name: 'selectedType',
                message: 'Select the type of file you want to generate.',
                choices: [...hasName, 'api', 'storage'],
            }
            const questions = [askType];
            const { selectedType } = await ask(questions)
            type = selectedType;

            if (hasName.includes(selectedType)) {
                const askName = { type: 'input', name: 'selectedName', message: `Set your ${selectedType} name: ` }
                const questions2 = [askName];
                const { selectedName } = await ask(questions2);
                name = selectedName;
            }
        }

        switch (type) {
            case 'duck':
                createDuck(name);
                break;
            case 'sagas':
                break;
            default:
                error(`Please define which template you want to generate.`)
                info(`Available Templates: duck, sagas`)
                break;
        }
    }
}

module.exports = generateModule;