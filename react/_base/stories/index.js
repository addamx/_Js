import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Button from '../src/component/common/Button';
import Input from '../src/component/common/Input';

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('animate button', () => (
    <Button onClick={action('clicked')} animate={true}>animating</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}><span role="img" aria-label="so cool">😀 😎 👍 💯</span></Button>
  ));


storiesOf('Input', module)
  .add('password', () => (
    <Input type="password" onChange={action('onChange')} />
  ))
  .add('email', () => (
    <Input type="email" onChange={action('onChange')} />
  ))