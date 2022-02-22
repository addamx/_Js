import React, { Children } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components";

import buttonStyles from "./buttonStyles";
import Wrapper from "./Wrapper";

const Button = props => {
  const StyledButton = styled.button`
    ${buttonStyles};
  `;

  let button = (
    <a href={props.href}>
      {Children.toArray(props.children)}
    </a>
  );

  if (props.onClick) {
    button = (
      <StyledButton onClick={props.onClick} animate={props.animate}>
        {Children.toArray(props.children)}
      </StyledButton>
    );
  }

  return <Wrapper>{button}</Wrapper>;
};



Button.propTypes = {
  href: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default Button;


