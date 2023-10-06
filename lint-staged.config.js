module.exports = {
    '*.{js,jsx,ts,tsx}': [
        'eslint . --ext .js,.jsx,.ts,.tsx --cache',
        'npm run format',
        () => 'npm run type-check',
        'npm run test',
    ],
};
