const generateModule = {
    name: 'generate',
    alias: ['g'],
    toolbox: null,
    run: async toolbox => {
        this.toolbox = toolbox;

        const {
            filesystem,
            parameters,
            print: { info, error }
        } = toolbox


        const type = parameters.first;
        if (!type) { error('Type name must be specified'); return; }

        const name = parameters.second;
        if (!name) { error('Module name must be specified'); return; }

        const package = await filesystem.read('package.json', 'json');
        const isReactNative = !!package.dependencies['react-native']

        switch (type) {
            case 'duck':
                generateModule.generateDuck(name);
                break;
            case 'sagas':
                break;
            default:
                error(`Please define which template you want to generate.`)
                info(`Available Templates: duck, sagas`)
                break;
        }
    },
    generateDuck: async name => {
        const {
            template: { generate },
            print: { success, info },
            filesystem: { exists },
            patching: { patch, exists: pExists }
        } = this.toolbox;

        const duckIndex = `src/store/ducks/index.js`
        const target = `src/store/ducks/${name}.js`;

        const createIndex = await generateModule.verifyExistsCreate(duckIndex)
        if (createIndex) {
            await generate({
                template: 'duckIndex.js.ejs',
                target: duckIndex,
                props: { nameUpper: name.toUpperCase(), nameLower: name.toLowerCase() }
            });
            success(`Generated duck at src/store/ducks/index.js`);
        }

        if (await generateModule.verifyExistsOverwrite(target)) {
            await generate({
                template: 'duck.js.ejs',
                target,
                props: { nameUpper: name.toUpperCase(), nameLower: name.toLowerCase() }
            });
            success(`Generated duck at src/store/ducks/${name}.js`);
        }

        let patched = false;
        const imported = await pExists(duckIndex, `${name}.js`);
        if (!createIndex && exists(duckIndex) && !imported) {
            if (generateModule.askPatch(target)) {
                await patch(duckIndex, { insert: `\n\nimport { reducer as ${name} } from './${name}';`, after: `import { combineReducers } from 'redux';` })
                await patch(duckIndex, { insert: `\n\t${name},`, after: 'combineReducers({' })
                patched = true;
            }
        }

        if (!createIndex && !patched && !imported) info(`Don't forget to add the reference to your ducks index.js file`);
    },
    askPatch: async target => {
        const { prompt: { ask } } = this.toolbox;

        const askPatch = {
            type: 'list',
            name: 'patch',
            message: `Do you want to add import to file ${target}?`,
            choices: ['yes', 'no'],
        }
        const questions = [askPatch];
        const { patch } = await ask(questions)

        return patch === 'yes' ? true : false
    },
    verifyExistsCreate: async target => {
        const { filesystem: { exists }, prompt: { ask } } = this.toolbox;

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
    },
    verifyExistsOverwrite: async target => {
        const { filesystem: { exists }, prompt: { ask }, print: { error } } = this.toolbox;

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
    }
}

module.exports = generateModule;