module.exports = (toolbox) => {
    const {
        template: { generate },
        print: { success },
    } = toolbox;

    async function createApi() {
        const target = `src/services/api.js`;

        if (await toolbox.verifyExistsOverwrite(target)) {
            await generate({
                template: 'api.js.ejs',
                target
            });
            success(`Generated API at ${target}`);
        }
    }

    toolbox.createApi = createApi;
}
