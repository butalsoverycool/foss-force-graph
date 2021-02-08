import React from "react";
import "./App.css";
import styled from "styled-components/macro";

import ForceGraph from "./components/forceGraph";
import inputData from "./components/forceGraph/data";

console.log("data", inputData);

const Main = styled.main`
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-around;
  display: flex;
`;

const Section = styled.div`
  width: 100%;
  max-width: 600px;
  height: 100vh; //temp
  padding: 0 20px;
  margin: 0 auto;
  background-color: #eee;
`;

const InfoSection = styled(Section)`
  width: 100%;
  padding: 0 10px;

  & * {
    text-align: left;
  }
`;

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>FOSS playground FUND</h1>
      </header>

      <Main>
        <Section>
          <ForceGraph data={inputData} />
        </Section>
      </Main>
    </div>
  );
}

export default App;
