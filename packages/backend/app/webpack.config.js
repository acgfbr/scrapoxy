const {promises: fs} = require('fs');
const {composePlugins, withNx} = require('@nx/webpack');
const {BannerPlugin} = require('webpack');


module.exports = composePlugins(withNx(), (config) => {
    // Add shebang to the scrapoxy.js file
    config.plugins.push(new BannerPlugin({banner: "#!/usr/bin/env node", raw: true}));

    // Make the scrapoxy.js file executable
    config.plugins.push({
        apply: (compiler) => {
            compiler.hooks.afterEmit.tapPromise('AfterEmitPlugin', async () => {
                // Add the version from the root package.json to the dist package.json
                const packageJsonRoot = JSON.parse(await fs.readFile('package.json'));
                const packageJsonDist = JSON.parse(await fs.readFile('dist/scrapoxy/package.json'));

                packageJsonDist.version = packageJsonRoot.version;

                await fs.writeFile('dist/scrapoxy/package.json', JSON.stringify(packageJsonDist, null, 4));

                // Make the scrapoxy.js file executable
                await fs.chmod('dist/scrapoxy/scrapoxy.js', '755');
            });
        }
    });

    return config;
});