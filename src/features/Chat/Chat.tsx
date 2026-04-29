import React, { useCallback, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  INPUT_PLACEHOLDER,
  SEND_BUTTON_LABEL,
  STATUS_LABEL_SENDING,
  STATUS_LABEL_SENT,
} from './constants';
import type { Message } from './types';
import useChat from './useChat';

// --- Constants ---
const KEYBOARD_VERTICAL_OFFSET = Platform.OS === 'ios' ? 90 : 0;
const KEYBOARD_AVOIDING_BEHAVIOR = Platform.OS === 'ios' ? 'padding' : 'height';

// --- Sub-component Props ---
interface MessageBubbleProps {
  item: Message;
}

// --- Sub-component ---
const MessageBubble: React.FC<MessageBubbleProps> = React.memo(({ item }) => {
  const isSending = item.status === 'sending';

  return (
    <View
      style={[styles.bubble, isSending ? styles.bubbleSending : styles.bubbleSent]}
      accessibilityLabel={`Message: ${item.text}. Status: ${isSending ? STATUS_LABEL_SENDING : STATUS_LABEL_SENT}`}
      accessibilityRole="text"
    >
      <Text style={styles.bubbleText}>{item.text}</Text>
      <View style={styles.statusRow}>
        {isSending ? (
          <ActivityIndicator
            size="small"
            color="#999"
            accessibilityLabel={STATUS_LABEL_SENDING}
          />
        ) : null}
        <Text style={styles.statusText}>
          {isSending ? STATUS_LABEL_SENDING : STATUS_LABEL_SENT}
        </Text>
      </View>
    </View>
  );
});

// --- Main Component Props ---
interface ChatProps {
  screenTitle?: string;
}

// --- Component ---
const Chat: React.FC<ChatProps> = ({ screenTitle = 'Chat' }) => {
  const { messages, inputText, isSending, sendError, setInputText, sendMessage } = useChat();
  const listRef = useRef<FlatList<Message>>(null);

  const isDisabled = useMemo(
    () => isSending || inputText.trim().length === 0,
    [isSending, inputText],
  );

  const keyExtractor = useCallback((item: Message) => item.id, []);

  const renderItem = useCallback(
    ({ item }: { item: Message }) => <MessageBubble item={item} />,
    [],
  );

  // No dependency on messages.length — scrollToEnd is safe to call on an empty list
  const handleContentSizeChange = useCallback(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, []);

  const sendButtonStyle = useCallback(
    ({ pressed }: { pressed: boolean }) => [
      styles.sendButton,
      pressed && styles.sendButtonPressed,
      isDisabled && styles.sendButtonDisabled,
    ],
    [isDisabled],
  );

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={KEYBOARD_AVOIDING_BEHAVIOR}
      keyboardVerticalOffset={KEYBOARD_VERTICAL_OFFSET}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{screenTitle}</Text>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={handleContentSizeChange}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={5}
        accessibilityLabel="Message list"
      />

      {sendError !== null ? <Text style={styles.errorText}>{sendError}</Text> : null}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder={INPUT_PLACEHOLDER}
          placeholderTextColor="#999"
          multiline
          accessibilityLabel="Message input"
          accessibilityRole="none"
          accessibilityHint="Type your message here"
          returnKeyType="send"
          onSubmitEditing={sendMessage}
        />
        <Pressable
          style={sendButtonStyle}
          onPress={sendMessage}
          disabled={isDisabled}
          accessibilityLabel={SEND_BUTTON_LABEL}
          accessibilityRole="button"
          accessibilityHint="Tap to send your message"
          accessibilityState={{ disabled: isDisabled }}
        >
          <Text style={styles.sendButtonText}>{SEND_BUTTON_LABEL}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  listContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexGrow: 1,
    width: '100%',
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    alignSelf: 'flex-end',
  },
  bubbleSending: {
    backgroundColor: '#d0eaff',
  },
  bubbleSent: {
    backgroundColor: '#0a84ff',
  },
  bubbleText: {
    fontSize: 15,
    color: '#1a1a1a',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
    alignSelf: 'flex-end',
  },
  statusText: {
    fontSize: 11,
    color: '#666',
  },
  errorText: {
    fontSize: 13,
    color: '#d32f2f',
    marginHorizontal: 16,
    marginBottom: 4,
    alignSelf: 'stretch',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 0,
    marginHorizontal: 16,
    marginBottom: 16,
    alignSelf: 'stretch',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#0a84ff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 4,
    marginBottom: 2,
  },
  sendButtonPressed: {
    opacity: 0.7,
  },
  sendButtonDisabled: {
    backgroundColor: '#b0cfff',
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default React.memo(Chat);
