module.exports = {
    plugins: [
        [
            'babel-plugin-import',
            {
                libraryName: '@mui/material',
                libraryDirectory: '',
                camel2DashComponentName: false,
            },
            'core',
        ],
        [
            'babel-plugin-import',
            {
                libraryName: '@mui/icons-material',
                libraryDirectory: '',
                camel2DashComponentName: false,
            },
            'icons',
        ],
    ],
    presets: ['@babel/preset-react', '@babel/preset-typescript'],
};
