module.exports = (toolbox) => {
    const { filesystem: { read } } = toolbox;

    async function isReactNative() {
        const package = await read('package.json', 'json');
        return !!package.dependencies['react-native'];
    }

    toolbox.isReactNative = isReactNative;
}