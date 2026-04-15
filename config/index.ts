import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
// Taro 项目配置
const config = {
  projectName: 'awo-shuile',
  date: '2026-4-3',
  designWidth: 750,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: ['@tarojs/plugin-framework-react'],
  defineConstants: {},
  alias: {
    '@': require('path').resolve(__dirname, '..', 'src')
  },
  copy: {
    patterns: [],
    options: {}
  },
  framework: 'react',
  compiler: {
    type: 'webpack5',
    prebundle: { enable: false }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    router: {
      mode: 'browser'
    },
    htmlPluginOption: {
      template: require('path').join(__dirname, '../src/index.html')
    },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      pxtransform: {
        enable: true,
        config: {
          // baseFontSize: 75
        }
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]__[hash:base64:5]'
        }
      }
    },
    webpackChain(chain) {
      chain.resolve.plugin("tsconfig-paths").use(TsconfigPathsPlugin);
    }
  }
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'));
  }
  return merge({}, config, require('./prod'));
};