import styled, {injectGlobal} from 'styled-components';

const BaseInput = styled.input`
    border: 2px solid ${props => props.theme.borderColor};
    color: #4AAAAA;
`;


//一般放在入口文件
injectGlobal`
input {
    font-size: 1rem;
}
`

const PasswordInput = BaseInput.extend.attrs({
    type: 'password',
})`
    padding: 0.2em 0.2em 0.2em;
`;

const EmailInput = BaseInput.extend.attrs({
    type: 'email',
}) `
    padding: 0.2em 0.2em 0.2em 1.5em;
`;


export {
    PasswordInput,
    EmailInput
};