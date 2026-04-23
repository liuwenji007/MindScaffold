import { Component, ReactNode } from 'react';
import Taro from '@tarojs/taro';
import { migrateBrandStorageKeys, migrateLegacyCardsToV2 } from '@/services/storage';
import './app.scss';

interface AppProps {
  children?: ReactNode;
}

class App extends Component<AppProps> {
  componentDidMount() {
    migrateBrandStorageKeys().catch(error => {
      console.error('Failed to migrate storage keys:', error);
    });
    migrateLegacyCardsToV2().catch(error => {
      console.error('Failed to migrate cards to v2:', error);
    });
  }

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return this.props.children;
  }
}

export default App;