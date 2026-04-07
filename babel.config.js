module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { browsers: ['last 2 versions', 'not dead'] } }],
    ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
    ['@babel/preset-react', { runtime: 'classic' }]
  ]
};