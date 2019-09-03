module.exports = (toolbox) => {
    const {
        template: { generate },
        print: { success },
        strings: { upperCase, lowerCase, upperFirst }
    } = toolbox;

    async function createComponent(type, name) {
        const nameUpper = upperCase(name), nameLower = lowerCase(name), nameCapitalized = upperFirst(name);
        const rn = await toolbox.isReactNative();

        let template, stylesTemplate, target, stylesTarget;

        let useRedux = await toolbox.askMessage(`Do you want to add redux import to your ${type}?`);

        target = `src/${type}s/${nameCapitalized}/index.js`;
        stylesTarget = `src/${type}s/${nameCapitalized}/styles.js`;

        if (rn) {
            template = useRedux ? 'RNReduxComponent.js.ejs' : 'RNComponent.js.ejs';
            stylesTemplate = 'RNStyles.js.ejs';
        } else {
            template = useRedux ? 'RReduxComponent.js.ejs' : 'RComponent.js.ejs';
            stylesTemplate = 'RStyles.js.ejs';
        }

        if (await toolbox.verifyExistsOverwrite(target)) {
            await generate({
                template,
                target,
                props: { nameUpper, nameLower, nameCapitalized }
            });
            success(`Generated component at ${target}`);
        }

        if (await toolbox.askMessage(`Would you like to add the style file?`)) {
            if (await toolbox.verifyExistsOverwrite(stylesTarget)) {
                await generate({
                    template: stylesTemplate,
                    target: stylesTarget,
                    props: { nameUpper, nameLower, nameCapitalized }
                });
                success(`Generated styles at ${stylesTarget}`);
            }
        }

    }

    toolbox.createComponent = createComponent;
}