module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: 'airbnb',
    overrides: [
        {
            env: {
                node: true
            },
            files: [
                '.eslintrc.{js,cjs}'
            ],
            parserOptions: {
                sourceType: 'script'
            }
        }
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    rules: {
        indent: ['error', 4],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'no-restricted-globals': 'off',
        semi: ['error', 'never'],
        'no-alert': 'off',
        'comma-dangle': ['error', 'never'],
        'no-console': 'off',
        'max-classes-per-file': 'off',
        'linebreak-style': ['error', 'unix'],
        'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
        'no-trailing-spaces': 'error',
        'arrow-spacing': ['error', { before: true, after: true }],
        'object-curly-spacing': ['error', 'always'],
        'react/jsx-props-no-spreading': 'off',
        'react/prop-types': 'off'
    }
}
