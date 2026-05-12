import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import { sendVerificationCode, verifyCode, passwordLogin, isLoggedIn } from '@/services/auth';
import { AppIcon } from '@/components/AppIcon';
import './index.scss';

type LoginMode = 'code' | 'password';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loginMode, setLoginMode] = useState<LoginMode>('code');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useLoad(() => {
    if (isLoggedIn()) {
      Taro.switchTab({ url: '/pages/index/index' });
    }
  });

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const startCountdown = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(60);
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async () => {
    setError('');
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }

    const ok = await sendVerificationCode(phone);
    if (ok) {
      Taro.showToast({ title: '验证码已发送（开发环境请查看终端日志）', icon: 'none', duration: 3000 });
      startCountdown();
    } else {
      Taro.showToast({ title: '发送失败，请检查网络或后端服务', icon: 'none' });
    }
  };

  const handleSubmit = async () => {
    setError('');
    if (!phone) {
      Taro.showToast({ title: '请输入手机号', icon: 'none' });
      return;
    }

    setLoading(true);
    let user = null;

    if (loginMode === 'password') {
      if (!password) {
        Taro.showToast({ title: '请输入密码', icon: 'none' });
        setLoading(false);
        return;
      }
      user = await passwordLogin(phone, password);
    } else {
      if (!code) {
        Taro.showToast({ title: '请输入验证码', icon: 'none' });
        setLoading(false);
        return;
      }
      user = await verifyCode(phone, code);
    }

    setLoading(false);

    if (user) {
      const tip = isRegister ? `欢迎加入，${user.nickname}` : `欢迎回来，${user.nickname}`;
      Taro.showToast({ title: tip, icon: 'success' });
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/index/index' });
      }, 800);
    } else {
      setError(loginMode === 'password' ? '手机号或密码错误' : '验证码错误或已过期');
    }
  };

  return (
    <View className='login-page'>
      <View className='login-header'>
        <View className='login-logo'>
          <AppIcon name='wind' size={40} color='#151921' />
        </View>
        <Text className='login-title'>欢迎来到阿窝</Text>
        <Text className='login-quote'>「在这片宁静的角落，你可以放下所有的疲惫。」</Text>
      </View>

      <View className='login-card'>
        {/* 登录/注册 Tab */}
        <View className='login-tabs'>
          <View
            className={`login-tab ${!isRegister ? 'login-tab-active' : ''}`}
            onClick={() => { setIsRegister(false); setError(''); }}
          >
            <Text className='login-tab-text'>登录</Text>
            {!isRegister ? <View className='login-tab-underline' /> : null}
          </View>
          <View
            className={`login-tab ${isRegister ? 'login-tab-active' : ''}`}
            onClick={() => { setIsRegister(true); setError(''); }}
          >
            <Text className='login-tab-text'>注册</Text>
            {isRegister ? <View className='login-tab-underline' /> : null}
          </View>
        </View>

        {isRegister ? (
          <Text className='login-mode-hint'>新用户首次验证手机号即可完成注册</Text>
        ) : null}

        {/* 验证码/密码 切换 */}
        <View className='login-mode-switch'>
          <View
            className={`login-mode-tab-wrap ${loginMode === 'code' ? 'login-mode-tab-wrap-active' : ''}`}
            onClick={() => {
              setLoginMode('code');
              setError('');
            }}
          >
            <Text className='login-mode-tab-label'>验证码登录</Text>
          </View>
          <Text className='login-mode-divider'>|</Text>
          <View
            className={`login-mode-tab-wrap ${loginMode === 'password' ? 'login-mode-tab-wrap-active' : ''}`}
            onClick={() => {
              setLoginMode('password');
              setError('');
            }}
          >
            <Text className='login-mode-tab-label'>密码登录</Text>
          </View>
        </View>

        <View className='login-field'>
          <Text className='login-label'>手机号</Text>
          <View className='login-input-wrap'>
            <Input
              className='login-input'
              type='number'
              maxlength={11}
              placeholder='请输入手机号'
              placeholderClass='login-placeholder'
              value={phone}
              onInput={e => setPhone(e.detail.value)}
            />
          </View>
        </View>

        {loginMode === 'code' ? (
          <View className='login-field'>
            <Text className='login-label'>验证码</Text>
            <View className='login-code-row'>
              <View className='login-input-wrap login-code-input-grow'>
                <Input
                  className='login-input'
                  type='number'
                  maxlength={6}
                  placeholder='验证码'
                  placeholderClass='login-placeholder'
                  value={code}
                  onInput={e => setCode(e.detail.value)}
                />
              </View>
              <View
                className={`login-code-btn ${countdown > 0 ? 'login-code-btn-disabled' : ''}`}
                onClick={countdown > 0 ? undefined : handleSendCode}
              >
                <Text className='login-code-btn-text'>{countdown > 0 ? `${countdown}s` : '获取验证码'}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View className='login-field'>
            <Text className='login-label'>密码</Text>
            <View className='login-input-wrap'>
              <Input
                className='login-input'
                password
                placeholder='请输入密码'
                placeholderClass='login-placeholder'
                value={password}
                onInput={e => setPassword(e.detail.value)}
              />
            </View>
          </View>
        )}

        {error ? (
          <Text className='login-error'>{error}</Text>
        ) : null}

        <View
          className={`login-submit ${loading ? 'login-submit-loading' : ''}`}
          onClick={loading ? undefined : handleSubmit}
        >
          <Text className='login-submit-text'>
            {loading ? '处理中...' : isRegister ? '开启旅程' : '进入被窝'}
          </Text>
        </View>

        {/* 超管快捷入口 (开发环境) */}
        <View
          className='login-admin-hint'
          onClick={() => { setPhone('admin'); setPassword('admin123'); setLoginMode('password'); }}
        >
          <Text className='login-admin-hint-text'>开发：点击填入超管账号</Text>
        </View>
      </View>

      <View className='login-legal-row'>
        <Text className='login-legal'>登录即表示您同意我们的 </Text>
        <Text className='login-legal-link'>服务条款</Text>
        <Text className='login-legal'> 与 </Text>
        <Text className='login-legal-link'>隐私政策</Text>
      </View>

      <Text className='login-hint'>开发环境：验证码会打印在后端终端日志中</Text>
    </View>
  );
}
