module.exports = (toolbox) => {
    const {
        template: { generate },
        print: { success, info },
        filesystem: { exists },
        strings: { upperCase, lowerCase, upperFirst },
        patching: { patch, exists: pExists },
    } = toolbox;

    async function createSagas(name) {
        const nameUpper = upperCase(name), nameLower = lowerCase(name), nameCapitalized = upperFirst(name);
        const sagasIndex = `src/store/sagas/index.js`;
        const target = `src/store/sagas/${nameLower}.js`;
        const apiTarget = `src/services/api.js`;

        const createIndex = await toolbox.verifyExistsCreate(sagasIndex)
        if (createIndex) {
            await generate({
                template: 'sagasIndex.js.ejs',
                target: sagasIndex,
                props: { nameUpper, nameLower, nameCapitalized }
            });
            success(`Generated sagas at src/store/sagas/index.js`);
        }

        if (await toolbox.verifyExistsOverwrite(target)) {
            await generate({
                template: 'sagas.js.ejs',
                target,
                props: { nameUpper, nameLower, nameCapitalized }
            });
            success(`Generated sagas at src/store/sagas/${nameLower}.js`);
        }

        const importedJS = await pExists(sagasIndex, `import { ${nameCapitalized}Types } from '../ducks/${nameLower}';`);
        const importedName = await pExists(sagasIndex, `takeLatest(${nameCapitalized}Types.${nameUpper}_REQUEST, request${nameCapitalized}),`);

        if (!createIndex && await exists(sagasIndex) && (!importedJS || !importedName)) {
            if (await toolbox.askPatch(target)) {
                if (!importedJS) await patch(sagasIndex, { insert: `\n\nimport { ${nameCapitalized}Types } from '../ducks/${nameLower}';\nimport { request${nameCapitalized} } from './${nameLower}';`, after: `import { all, takeLatest } from 'redux-saga/effects';` });
                if (!importedName) await patch(sagasIndex, { insert: `\n\n\t\ttakeLatest(${nameCapitalized}Types.${nameUpper}_REQUEST, request${nameCapitalized}),`, after: 'return yield all([' })
            }
        }

        if (!createIndex && (!importedJS || !importedName)) info(`Don't forget to add the reference to your sagas index.js file`)

        if (!await exists(apiTarget)) if (await toolbox.askMessage('API file not found, would you like to create it?')) await toolbox.createApi();
    }

    toolbox.createSagas = createSagas;
};