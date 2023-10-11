const path = require('path');

module.exports = {
    webpack: (config, options) => {
        config.resolve.extensions.push('.ts', '.tsx');

        config.module.rules.push({
            test: /\.tsx?$/,
            include: [path.resolve(__dirname, '../shared-types')],
            use: [options.defaultLoaders.babel, { loader: 'ts-loader' }],
        });

        return config;
    },
};
