import React from 'react';
import { View, Text, Textarea } from '@tarojs/components';
import type { AwEmotionCard } from '@/types/emotion';

interface HistoryDetailPanelProps {
  card: AwEmotionCard;
  feedback: string;
  sharing: boolean;
  onFeedbackChange: (value: string) => void;
  onClose: () => void;
  onComplete: () => void;
  onLetGo: () => void;
  onShareLeaf: () => void;
  onContinueChat: () => void;
  onOpenShare: () => void;
  onCloseShare: () => void;
}

export function HistoryDetailPanel(props: HistoryDetailPanelProps) {
  const {
    card,
    feedback,
    sharing,
    onFeedbackChange,
    onClose,
    onComplete,
    onLetGo,
    onShareLeaf,
    onContinueChat,
    onOpenShare,
    onCloseShare
  } = props;

  return (
    <View className='historyModalMask'>
      <View className='historyModal'>
        <View className='historyModalBack' onClick={onClose}>
          <Text className='historyModalBackText'>‹</Text>
        </View>
        <Text className='historyModalDate'>{card.date}</Text>
        <Text className='historyModalTitle'>情绪详情</Text>

        <View className='historySection'>
          <Text className='historySectionLabel'>当时的心情</Text>
          <Text className='historySectionBody'>「{card.input || '没有留下文字描述'}」</Text>
        </View>

        <View className='historySection'>
          <Text className='historySectionLabel'>AI 镜像重述</Text>
          <View className='historyMirrorBox'>
            <Text className='historyMirrorBoxText'>{card.mirrorText}</Text>
          </View>
        </View>

        <View className='historySection'>
          <View className='historySectionRow'>
            <Text className='historySectionLabel'>对话记录</Text>
            <View className='historyContinueChat' onClick={onContinueChat}>
              <Text className='historyContinueChatText'>继续聊聊</Text>
            </View>
          </View>
          {card.chatHistory && card.chatHistory.length > 0 ? (
            <View className='historyChatPreviewList'>
              {card.chatHistory.slice(-2).map((item, idx) => (
                <View
                  key={`${item.role}-${idx}`}
                  className={item.role === 'user' ? 'historyChatPreviewItem historyChatPreviewItemUser' : 'historyChatPreviewItem historyChatPreviewItemAi'}
                >
                  <Text className={item.role === 'user' ? 'historyChatPreviewTextUser' : 'historyChatPreviewTextAi'}>
                    {item.content}
                  </Text>
                </View>
              ))}
              {card.chatHistory.length > 2 ? (
                <Text className='historyChatHint'>点击“继续聊聊”查看完整对话</Text>
              ) : null}
            </View>
          ) : (
            <Text className='historyChatHint'>还没有开始对话</Text>
          )}
        </View>

        <View className='historySection'>
          <Text className='historySectionLabel'>预定的微行动</Text>
          <View className='historyActionBox'>
            <Text className='historyActionTitle'>{card.action}</Text>
            <Text className='historyActionTime'>预计时长：{card.duration}</Text>
          </View>
        </View>

        <View className='historyModalButtons'>
          {card.status === 'pending' ? (
            <View className='historyModalButton historyModalButtonPrimary' onClick={onComplete}>
              <Text className='historyModalButtonPrimaryText'>标记完成</Text>
            </View>
          ) : null}
          {card.status === 'completed' && !card.isLeaf ? (
            <View className='historyModalButton historyModalButtonGreen' onClick={onOpenShare}>
              <Text className='historyModalButtonGreenText'>分享树叶</Text>
            </View>
          ) : null}
          <View className='historyModalButton historyModalButtonDanger' onClick={onLetGo}>
            <Text className='historyModalButtonDangerText'>放进树洞</Text>
          </View>
        </View>

        {sharing ? (
          <View className='historyShareSheet'>
            <Text className='historyShareTitle'>分享你的收获</Text>
            <Textarea
              className='historyShareTextarea'
              maxlength={280}
              value={feedback}
              onInput={event => onFeedbackChange(event.detail.value)}
              placeholder='写下这件事最终的反馈与收获...'
              placeholderClass='historySharePlaceholder'
            />
            <View className='historyShareButtons'>
              <View className='historyShareButton historyShareButtonGhost' onClick={onCloseShare}>
                <Text className='historyShareButtonGhostText'>取消</Text>
              </View>
              <View className='historyShareButton historyShareButtonPrimary' onClick={onShareLeaf}>
                <Text className='historyShareButtonPrimaryText'>确认分享</Text>
              </View>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}
