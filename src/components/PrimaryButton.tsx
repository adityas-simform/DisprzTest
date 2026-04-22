import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ViewStyle } from 'react-native';

// --- Constants ---
const BUTTON_ACTIVE_OPACITY = 0.7;

// --- Props Interface ---
interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
}

// --- Component ---
const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  disabled = false,
  testID,
}) => {
  const handlePress = useCallback(() => {
    if (!disabled) {
      onPress();
    }
  }, [disabled, onPress]);

  const containerStyle: ViewStyle[] = [
    styles.container,
    disabled ? styles.containerDisabled : styles.containerEnabled,
  ];

  return (
    <View style={containerStyle}>
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.pressable,
          pressed && styles.pressableActive,
        ]}
        accessibilityLabel={label}
        accessibilityRole="button"
        accessibilityHint={`Tap to ${label}`}
        accessibilityState={{ disabled }}
        testID={testID}
      >
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  containerEnabled: {
    backgroundColor: '#4F46E5',
  },
  containerDisabled: {
    backgroundColor: '#A0A0A0',
  },
  pressable: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  pressableActive: {
    opacity: BUTTON_ACTIVE_OPACITY,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

// --- Export ---
export default React.memo(PrimaryButton);
