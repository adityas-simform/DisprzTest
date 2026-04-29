import type { PrimaryButtonProps } from '../../PrimaryButton';

export const defaultProps: PrimaryButtonProps = {
  label: 'Submit',
  onPress: jest.fn(),
  testID: 'primaryButton',
};

export const disabledProps: PrimaryButtonProps = {
  ...defaultProps,
  disabled: true,
};
