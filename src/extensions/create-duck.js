module.exports = (toolbox) => {
    const {
        template: { generate },
        print: { success, info },
        filesystem: { exists },
        patching: { patch, exists: pExists },
    } = toolbox;

    async function createDuck(name) {
        const nameUpper = name.toUpperCase(), nameLower = name.toLowerCase();
        const duckIndex = `src/store/ducks/index.js`;
        const target = `src/store/ducks/${nameLower}.js`;

        const createIndex = await toolbox.verifyExistsCreate(duckIndex)
        if (createIndex) {
            await generate({
                template: 'duckIndex.js.ejs',
                target: duckIndex,
                props: { nameUpper, nameLower }
            });
            success(`Generated duck at src/store/ducks/index.js`);
        }

        if (await toolbox.verifyExistsOverwrite(target)) {
            await generate({
                template: 'duck.js.ejs',
                target,
                props: { nameUpper, nameLower }
            });
            success(`Generated duck at src/store/ducks/${nameLower}.js`);
        }

        const importedJS = await pExists(duckIndex, `import { reducer as ${nameLower} } from './${nameLower}';`);
        const importedName = await pExists(duckIndex, `${nameLower},`);

        if (!createIndex && await exists(duckIndex) && (!importedJS || !importedName)) {
            if (await toolbox.askPatch(target)) {
                if (!importedJS) await patch(duckIndex, { insert: `\n\nimport { reducer as ${nameLower} } from './${nameLower}';`, after: `import { combineReducers } from 'redux';` });
                if (!importedName) await patch(duckIndex, { insert: `\n\t${nameLower},`, after: 'combineReducers({' })
            }
        }

        if (!createIndex && (!importedJS || !importedName)) info(`Don't forget to add the reference to your ducks index.js file`)
    }

    toolbox.createDuck = createDuck;
};