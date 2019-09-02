module.exports = (toolbox) => {
    const {
        template: { generate },
        print: { success, info },
        filesystem: { exists },
        patching: { patch, exists: pExists },
    } = toolbox;

    async function createDuck(name) {
        const duckIndex = `src/store/ducks/index.js`
        const target = `src/store/ducks/${name}.js`;

        const createIndex = await toolbox.verifyExistsCreate(duckIndex)
        if (createIndex) {
            await generate({
                template: 'duckIndex.js.ejs',
                target: duckIndex,
                props: { nameUpper: name.toUpperCase(), nameLower: name.toLowerCase() }
            });
            success(`Generated duck at src/store/ducks/index.js`);
        }

        if (await toolbox.verifyExistsOverwrite(target)) {
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
            if (toolbox.askPatch(target)) {
                await patch(duckIndex, { insert: `\n\nimport { reducer as ${name} } from './${name}';`, after: `import { combineReducers } from 'redux';` })
                await patch(duckIndex, { insert: `\n\t${name},`, after: 'combineReducers({' })
                patched = true;
            }
        }

        if (!createIndex && !patched && !imported) info(`Don't forget to add the reference to your ducks index.js file`);
    }

    toolbox.createDuck = createDuck;
};