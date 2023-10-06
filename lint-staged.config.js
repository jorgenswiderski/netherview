// lint-staged.config.js
module.exports = {
    '*.{js,jsx}': ['npm run lint', 'npm run format', 'npm run test'],
    '*.{ts,tsx}': [
        'npm run lint',
        'npm run format',
        () => 'npm run type-check',
        'npm run test',
    ],
};
