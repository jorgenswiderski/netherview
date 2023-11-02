module.exports = {
    parserOptions: {
        ecmaVersion: 10,
        sourceType: 'module',
        project: './tsconfig.json',
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'airbnb',
        'plugin:prettier/recommended',
    ],
    overrides: [
        {
            extends: ['airbnb-typescript', 'prettier'],
            files: ['*.ts', '*.tsx'],
            rules: {
                'import/no-extraneous-dependencies': 'off',
                '@typescript-eslint/lines-between-class-members': 'off',
            },
        },
        {
            files: ['*.jsx', '*.tsx'],
            rules: {
                'import/no-default-export': 'off', // Default export is necessary for react
            },
        },
        {
            files: ['next.config.js'],
            rules: {
                'import/no-unresolved': 'off',
                'import/no-extraneous-dependencies': 'off',
                'import/order': 'off',
                'import/no-self-import': 'off',
            },
        },
    ],
    settings: {
        react: {
            version: 'detect',
        },
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
            espree: ['.js', '.jsx'],
        },
        'import/resolver': {
            typescript: {
                // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
                alwaysTryTypes: true,
            },
        },
    },
    env: {
        browser: true,
        es2019: true,
    },
    rules: {
        'react/react-in-jsx-scope': 'off', // Not needed for Next.js
        indent: ['error', 4],
        'import/prefer-default-export': 'off',
        'import/no-default-export': 'error',
        'no-console': 'error',
        'padding-line-between-statements': [
            'warn',
            {
                blankLine: 'always',
                prev: '*',
                next: [
                    'block',
                    'block-like',
                    'multiline-expression',
                    'multiline-block-like',
                    'multiline-const',
                    'multiline-let',
                    'multiline-var',
                    'return',
                ],
            },
            {
                blankLine: 'always',
                prev: [
                    'block',
                    'block-like',
                    'multiline-expression',
                    'multiline-block-like',
                    'multiline-const',
                    'multiline-let',
                    'multiline-var',
                ],
                next: '*',
            },
        ],
        'react/prop-types': 'off',
        curly: ['error', 'all'],
        'react/require-default-props': 'off',
        'react/jsx-props-no-spreading': 'off',
        'no-continue': 'off',
        'prefer-destructuring': [
            'error',
            {
                VariableDeclarator: {
                    array: false,
                    object: true,
                },
                AssignmentExpression: {
                    array: false,
                    object: false,
                },
            },
            {
                enforceForRenamedProperties: false,
            },
        ],

        // style rules
        'prettier/prettier': 'warn',
        'object-shorthand': 'warn',
    },
};
