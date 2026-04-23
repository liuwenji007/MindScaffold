export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/history/index',
    'pages/tree/index',
    'pages/profile/index',
    'pages/breakdown/index',
    'pages/mirror/index',
    'pages/chat/index',
    'pages/action/index',
    'pages/settings/index',
    'pages/store/index',
    'pages/treehole/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#f8f5f0',
    navigationBarTitleText: '阿窝睡了',
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
      { pagePath: 'pages/tree/index', text: '大树' },
      { pagePath: 'pages/profile/index', text: '我的' }
    ]
  }
});