import React from 'react';
import { render } from '@testing-library/react-native';

import PrimaryButton from '../PrimaryButton';
import { defaultProps, disabledProps } from './mock';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('PrimaryButton a11y tests', () => {
  describe('accessibilityLabel', () => {
    it('should set accessibilityLabel to the label prop value', () => {
      const { getByLabelText } = render(<PrimaryButton {...defaultProps} />);

      expect(getByLabelText('Submit')).not.toBeNull();
    });
  });

  describe('accessibilityRole', () => {
    it('should have accessibilityRole of "button"', () => {
      const { getByRole } = render(<PrimaryButton {...defaultProps} />);

      expect(getByRole('button')).not.toBeNull();
    });
  });

  describe('accessibilityHint', () => {
    it('should set accessibilityHint based on the label', () => {
      const { getByHintText } = render(<PrimaryButton {...defaultProps} />);

      expect(getByHintText('Tap to Submit')).not.toBeNull();
    });
  });

  describe('accessibilityState', () => {
    it('should report disabled=false when enabled', () => {
      const { getByRole } = render(<PrimaryButton {...defaultProps} />);

      expect(getByRole('button')).toHaveProp('accessibilityState', {
        disabled: false,
      });
    });

    it('should report disabled=true when disabled', () => {
      const { getByRole } = render(<PrimaryButton {...disabledProps} />);

      expect(getByRole('button')).toHaveProp('accessibilityState', {
        disabled: true,
      });
    });
  });
});
