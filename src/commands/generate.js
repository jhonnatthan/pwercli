module.exports = {
    name: 'generate',
    alias: ['g'],
    run: async toolbox => {
        const {
            parameters,
            print: { info, error },
            prompt: { ask },
            createDuck,
            createSagas
        } = toolbox;

        let type = parameters.first;
        let name = parameters.second;
        let hasName = ['duck', 'sagas', 'component', 'page'];

        if (!type) {
            const askType = {
                type: 'list',
                name: 'selectedType',
                message: 'Select the type of file you want to generate.',
                choices: [...hasName, 'api', 'storage'],
            }
            const questions = [askType];
            const { selectedType } = await ask(questions)
            type = selectedType;
        }

        if (!name && hasName.includes(type)) {
            const askName = { type: 'input', name: 'selectedName', message: `Set your ${type} name: ` }
            const questions2 = [askName];
            const { selectedName } = await ask(questions2);
            name = selectedName;
        }

        switch (type) {
            case 'duck':
                await createDuck(name);
                if (await toolbox.verifyExistsCreate(`src/store/sagas/${name.toLowerCase()}.js`, `Do you want to create ${name} sagas?`))
                    await createSagas(name);
                break;
            case 'sagas':
                await createSagas(name);
                if (await toolbox.verifyExistsCreate(`src/store/ducks/${name.toLowerCase()}.js`, `Do you want to create ${name} duck?`))
                    await createSagas(name);
                break;
            default:
                error(`Please define which template you want to generate.`)
                info(`Available Templates: duck, sagas`)
                break;
        }
    }
}