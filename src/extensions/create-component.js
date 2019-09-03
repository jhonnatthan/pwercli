module.exports = (toolbox) => {
    const {
        template: { generate },
        print: { success, info },
        filesystem: { exists },
        strings: { upperCase, lowerCase, upperFirst },
        patching: { patch, exists: pExists },
    } = toolbox;

    async function createComponent(type, name) {
        const nameUpper = upperCase(name), nameLower = lowerCase(name), nameCapitalized = upperFirst(name);
        const rn = toolbox.isReactNative();

        let template, target;
        
        if(type === 'page') {
            
        } else {

        }

        if (await toolbox.verifyExistsOverwrite(target)) {
            await generate({
                template,
                target,
                props: { nameUpper, nameLower, nameCapitalized }
            });
            success(`Generated component at ${target}`);
        }
    }

    toolbox.createComponent = createComponent;
}