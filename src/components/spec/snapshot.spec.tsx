import React from 'react';
import renderer from 'react-test-renderer';

import PrimaryButton from '../PrimaryButton';
import { defaultProps, disabledProps } from './mock';

describe('PrimaryButton snapshot tests', () => {
  it('should match snapshot when enabled', () => {
    const tree = renderer.create(<PrimaryButton {...defaultProps} />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should match snapshot when disabled', () => {
    const tree = renderer.create(<PrimaryButton {...disabledProps} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
