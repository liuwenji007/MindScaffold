export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/history/index',
    'pages/profile/index',
    'pages/breakdown/index',
    'pages/mirror/index',
    'pages/action/index',
    'pages/treehole/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#f8f5f0',
    navigationBarTitleText: 'MindScaffold',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    custom: true,
    color: '#7a7a7a',
    selectedColor: '#81b29a',
    backgroundColor: '#ffffff',
    list: [
      { pagePath: 'pages/index/index', text: '首页' },
      { pagePath: 'pages/history/index', text: '历史' },
      { pagePath: 'pages/profile/index', text: '我的' }
    ]
  }
});