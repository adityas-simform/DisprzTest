import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import PrimaryButton from '../PrimaryButton';
import { defaultProps, disabledProps } from './mock';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('PrimaryButton unit tests', () => {
  describe('when the button is enabled', () => {
    it('should call onPress when pressed', () => {
      const { getByTestId } = render(<PrimaryButton {...defaultProps} />);

      fireEvent.press(getByTestId('primaryButton'));

      expect(defaultProps.onPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the button is disabled', () => {
    it('should not call onPress when pressed', () => {
      const { getByTestId } = render(<PrimaryButton {...disabledProps} />);

      fireEvent.press(getByTestId('primaryButton'));

      expect(disabledProps.onPress).not.toHaveBeenCalled();
    });
  });

  describe('when the label prop changes', () => {
    it('should render the new label text', () => {
      const { getByText } = render(
        <PrimaryButton {...defaultProps} label="Confirm" />,
      );

      expect(getByText('Confirm')).not.toBeNull();
    });
  });
});
