module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        'airbnb',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended'
    ],
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
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    rules: {
        indent: ['error', 4],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'react/jsx-props-no-spreading': 'off',
        'react/prop-types': 'off',
        'newline-per-chained-call': 'off',
        'no-console': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'off',
        semi: ['error', 'never'],
        'comma-dangle': ['error', 'never']
    },
    settings: {
        react: {
            version: 'detect'
        }
    }
}
