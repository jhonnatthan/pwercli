module.exports = {
    name: 'teste',
    run: async toolbox => {
        const { print, parameters } = toolbox;

        console.log(parameters);
        print.error('Top');
    }
}