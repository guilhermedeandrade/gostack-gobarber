import styled from 'styled-components'
import { shade } from 'polished'

export const Container = styled.div`
  > header {
    height: 144px;
    background-color: #28262e;

    display: flex;
    align-items: center;

    div {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;

      svg {
        color: #999591;
        width: 24px;
        height: 24px;
      }
    }
  }
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  place-content: center;

  width: 100%;
  margin: -175px auto 0;

  form {
    display: flex;
    flex-direction: column;
    margin: 80px 0;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
      font-size: 20px;
      text-align: left;
    }

    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.3s;

      &:hover {
        color: ${shade(0.2, '#f4ede8')};
      }
    }
  }
`

export const AvatarInput = styled.div`
  position: relative;
  margin-bottom: 32px;
  align-self: center;

  img {
    width: 186px;
    height: 186px;
    border-radius: 50%;
  }

  label {
    position: absolute;
    width: 48px;
    height: 48px;
    background-color: #ff9000;
    border-radius: 50%;
    border: 0;
    right: 0;
    bottom: 0;
    transition: background-color 0.3s;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 20px;
      height: 20px;
      color: #312e38;
    }

    input {
      display: none;
    }

    &:hover {
      background-color: ${shade(0.2, '#ff9000')};
    }
  }
`
