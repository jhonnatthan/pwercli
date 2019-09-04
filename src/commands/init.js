const { system } = require('gluegun/system');

module.exports = {
    name: 'init',
    alias: ['i'],
    run: async toolbox => {
        const { prompt: { ask }, parameters, print: { error, info, success } } = toolbox;

        let frameworks = ['react', 'react-native'];
        let framework = parameters.first;
        let name = parameters.second;
        let version = parameters.third;

        const askFramework = {
            type: 'list',
            name: 'selectedFramework',
            message: 'Select the framework you want to start.',
            choices: frameworks
        }
        const questions = [askFramework];

        if (!framework) {
            const { selectedFramework } = await ask(questions)
            framework = selectedFramework;
        } else {
            if (!frameworks.includes(framework)) {
                error('Selected framework is not valid.');
                const { selectedFramework } = await ask(questions)
                framework = selectedFramework;
            }
        }

        if (!name) {
            const askName = { type: 'input', name: 'selectedName', message: `Set your project name: ` }
            const questions2 = [askName];
            const { selectedName } = await ask(questions2);
            name = selectedName;
        }

        if (!version) {
            if (await toolbox.askMessage(`Deseja especificar uma versão para o ${framework}? `)) {
                const askVersion = { type: 'input', name: 'selectedVersion', message: `Deseja especificar uma versão para o ${framework}? ` }
                const questions2 = [askVersion];
                const { selectedVersion } = await ask(questions2);
                version = selectedVersion;
            } else {
                version = 'latest'
            }
        }

        let command;

        switch (framework) {
            case 'react-native':
                command = `react-native init ${name} --version react-native@${version} --template rocketseat-advanced`;
                break;
            case 'react':
                break;
            default:
                command = `react-native init ${name} --version react-native@${version} --template rocketseat-advanced`;
                break;
        }
        info('Loading...');
        const response = await system.run(command);
        success('Finished!');
    }
}