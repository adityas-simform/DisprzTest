import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import use{{FeatureName}} from './use{{FeatureName}}';

import { COMPONENT_TITLE } from './constants';

interface {{FeatureName}}Props {
  onDismiss?: () => void;
}

const {{FeatureName}}: React.FC<{{FeatureName}}Props> = ({ onDismiss }) => {
  const { data, isLoading, error, refresh } = use{{FeatureName}}();

  const handleDismiss = useCallback(() => {
    onDismiss?.();
  }, [onDismiss]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Loading…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>{error}</Text>
        <Pressable
          style={styles.button}
          onPress={refresh}
          accessibilityLabel="Retry"
          accessibilityRole="button"
          accessibilityHint="Retries the failed request"
        >
          <Text style={styles.buttonLabel}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{COMPONENT_TITLE}</Text>

      {/* TODO: render `data` here */}

      {onDismiss !== undefined && (
        <Pressable
          style={styles.button}
          onPress={handleDismiss}
          accessibilityLabel="Dismiss"
          accessibilityRole="button"
          accessibilityHint="Closes this view"
        >
          <Text style={styles.buttonLabel}>Dismiss</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default React.memo({{FeatureName}});
