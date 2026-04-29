import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import PrimaryButton from '../PrimaryButton';
import { defaultProps, disabledProps } from './mock';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('PrimaryButton functional tests', () => {
  describe('press interaction', () => {
    it('should invoke onPress exactly once on a single press', () => {
      const { getByTestId } = render(<PrimaryButton {...defaultProps} />);

      fireEvent.press(getByTestId('primaryButton'));

      expect(defaultProps.onPress).toHaveBeenCalledTimes(1);
    });

    it('should invoke onPress on each successive press', () => {
      const { getByTestId } = render(<PrimaryButton {...defaultProps} />);
      const button = getByTestId('primaryButton');

      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);

      expect(defaultProps.onPress).toHaveBeenCalledTimes(3);
    });
  });

  describe('disabled interaction', () => {
    it('should not invoke onPress when disabled', () => {
      const { getByTestId } = render(<PrimaryButton {...disabledProps} />);

      fireEvent.press(getByTestId('primaryButton'));

      expect(disabledProps.onPress).not.toHaveBeenCalled();
    });

    it('should invoke onPress after being re-enabled', () => {
      const { getByTestId, rerender } = render(
        <PrimaryButton {...disabledProps} />,
      );

      fireEvent.press(getByTestId('primaryButton'));
      expect(disabledProps.onPress).not.toHaveBeenCalled();

      rerender(<PrimaryButton {...defaultProps} />);
      fireEvent.press(getByTestId('primaryButton'));
      expect(defaultProps.onPress).toHaveBeenCalledTimes(1);
    });
  });
});
