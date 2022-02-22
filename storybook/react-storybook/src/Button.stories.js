import React from 'react'
import { withInfo } from '@storybook/addon-info';
import { wInfo } from './utils'

import {storiesOf} from '@storybook/react'
import {Button} from './Button'
import { text, color } from '@storybook/addon-knobs/react';

storiesOf('Button', module)
  .add('with background', () => (
    <Button bg="purple">Hello World</Button>
  ))
  .addWithJSX('with background1', () => (
    <Button bg="green">addon-jsx</Button>
  ))
  .addWithJSX(
    'with background2',
    withInfo(`
    description of the component
    `)(() =>
      <Button bg={text('bg', 'pink', 'group1')}>addon-info</Button>
    ),
  )
  .addWithJSX(
    'with background3',
    wInfo(`
      description of the component

      ~~~js
      some_js_code === true
      ~~~
    `)(() => (
      <Button bg={color('bg', 'green')}>addon-info1</Button>
    ))
  )
