module.exports = (toolbox) => {
    const {
        template: { generate },
        print: { success, info },
        filesystem: { exists },
        patching: { patch, exists: pExists },
    } = toolbox;

    async function createSagas(name) {
        const nameUpper = name.toUpperCase(), nameLower = name.toLowerCase(), nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);

        const sagasIndex = `src/store/sagas/index.js`;
        const target = `src/store/sagas/${nameLower}.js`;

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
                if (!importedName) await patch(sagasIndex, { insert: `\n\n\t\ttakeLatest(${nameCapitalized}Types.${nameUpper}_REQUEST, request${nameCapitalized}),`, after: 'init(),' })
            }
        }

        if (!createIndex && (!importedJS || !importedName)) info(`Don't forget to add the reference to your sagas index.js file`)
    }

    toolbox.createSagas = createSagas;
};