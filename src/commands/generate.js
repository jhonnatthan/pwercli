let generateModule = {
    name: 'generate',
    alias: ['g'],
    run: async toolbox => {
        generateModule.toolbox = toolbox;

        const {
            parameters,
            print: { info, error },
            createDuck
        } = toolbox;

        const type = parameters.first;
        if (!type) { error('Type name must be specified'); return; }

        const name = parameters.second;
        if (!name) { error('Module name must be specified'); return; }

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