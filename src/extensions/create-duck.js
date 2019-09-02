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

        const importedJS = await pExists(duckIndex, `import { reducer as ${name} } from './${name}';`);
        const importedName = await pExists(duckIndex, `${name},`);

        if (!createIndex && await exists(duckIndex) && (!importedJS || !importedName)) {
            if (await toolbox.askPatch(target)) {
                if (!importedJS) await patch(duckIndex, { insert: `\n\nimport { reducer as ${name} } from './${name}';`, after: `import { combineReducers } from 'redux';` });
                if (!importedName) await patch(duckIndex, { insert: `\n\t${name},`, after: 'combineReducers({' })
                patched = true;
            }
        }

        if (!createIndex && !patched && !imported) info(`Don't forget to add the reference to your ducks index.js file`);
    }

    toolbox.createDuck = createDuck;
};