module.exports = (toolbox) => {
    const {
        template: { generate },
        print: { success },
    } = toolbox;

    async function createStorage() {
        const target = `src/services/storage.js`;
        const rn = await toolbox.isReactNative();
        const template = rn ? 'RNStorage.js.ejs' : 'RStorage.js.ejs';

        if (await toolbox.verifyExistsOverwrite(target)) {
            await generate({
                template,
                target
            });
            success(`Generated API at ${target}`);
        }
    }

    toolbox.createStorage = createStorage;
}
