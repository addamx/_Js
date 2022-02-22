import React, { Children } from "react";
import PropTypes from 'prop-types';
import { ThemeProvider } from "styled-components";

import { PasswordInput, EmailInput } from "./StyledInput";

const Input = props => {
  let Input;
  switch (props.type) {
    case 'password':
      Input = PasswordInput;
      break;
    case 'email':
      Input = EmailInput;
      break;
    default:
      return;
  }

  const theme = {
    borderColor: '#DEDEDE'
  }

  return (
    <ThemeProvider theme={theme}>
      <Input onChange={props.onChange} />
    </ThemeProvider>
  )
};



Input.propTypes = {
  onChange: PropTypes.func
};

export default Input;


