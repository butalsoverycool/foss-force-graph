import React, { FC, SetStateAction } from "react";
import styled from "styled-components/macro";

interface Props {
  // state: boolean;
  // setState: (state: boolean) => void;
  label: string;
}

const Container = styled.div`
  width: 150px;
  height: 30px;
  padding: 10px 20px;
  border-radius: 30px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;

  > * {
    font-size: 0.8em;
  }
`;

const Option: FC<Props> = ({ /* state, setState, */ label, children }) => {
  return (
    <Container>
      {children}
      {/*  <input
        type="checkbox"
        checked={state}
        onChange={(e) => setState(e.target.checked)}
      /> */}
      <div>{label}</div>
    </Container>
  );
};

export default Option;
