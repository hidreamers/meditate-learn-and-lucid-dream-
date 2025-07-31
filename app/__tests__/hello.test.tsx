import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Meditation from '../meditation';

test('hello world!', () => {
  const { getByText } = render(<Meditation />);
  expect(getByText('Meditation')).toBeTruthy();
});