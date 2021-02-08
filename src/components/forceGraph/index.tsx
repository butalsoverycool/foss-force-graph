import React, {
  useReducer,
  useEffect,
  useRef,
  MutableRefObject,
  Reducer,
  useState,
} from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import styled from "styled-components/macro";
import { nodeRenderObject, centerAndFit } from "./nodeFunctions";
import layoutPreset from "./layoutPreset";
import { clone } from "../../helpers";
import handleCollision, { rescueNode } from "./handleCollision";
import { Data } from "./formatData";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  text-align: left;
  font-family: serif;
  font-weight: 100;
  font-size: 3.4em;
`;
const GraphRow = styled.div`
  position: absolute;
  right: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const Settings = styled.div`
  position: relative;
  z-index: 1;
  width: fit-content;
`;

const settingStyle = `
    width: 150px;
    height: 40px;
    border-radius: 30px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0;
    position: relative;
    z-index: 1;
`;

const Setting = styled.div`
  ${settingStyle}

  > * {
    font-size: 0.8em;
  }

  > input {
    width: 20px;
  }
`;

const SettingsBtn = styled.button`
  ${settingStyle}
  font-weight: 700;
  border: none;
  outline: none;
  cursor: pointer;
  justify-content: center;
`;

interface Settings {
  [key: string]: boolean;
}

const initialSettings: Settings = {
  particles: true,
  arrows: false,
};

const settingsReducer: any = (state: Settings, key: string) => ({
  ...state,
  [key]: !state[key],
});

interface Props {
  data: Data;
  width?: number;
  height?: number;
}

const Graph = ({
  data,
  width = layoutPreset.width,
  height = layoutPreset.height,
}: Props) => {
  const graphRef: MutableRefObject<ForceGraphMethods | undefined> = useRef();

  const [settings, toggleSetting] = useReducer<Reducer<Settings, string>>(
    settingsReducer,
    clone(initialSettings)
  );

  const [canvasSize, setCanvasSize] = useState({ width, height });

  const onResize = () => {
    const newSize = {
      width: window.innerWidth * 0.6,
      height: window.innerHeight * 0.6,
    };

    setCanvasSize(newSize);
  };

  const syncGraphView = () => {
    if (!graphRef.current || !data.nodes.length) return;
    handleCollision(graphRef.current, data.nodes, canvasSize);
    centerAndFit(graphRef.current, data.nodes);
  };

  useEffect(() => {
    if (!graphRef.current || !data.nodes.length) return;

    syncGraphView();
  }, [graphRef, canvasSize]);

  useEffect(() => {
    setCanvasSize({
      width: window.innerWidth * 0.6,
      height: window.innerHeight * 0.6,
    });

    window.addEventListener("resize", onResize, false);
    return () => window.removeEventListener("resize", onResize, false);
  }, []);

  return (
    <Container>
      <Title>
        Packages we think are <br /> important to you
      </Title>

      <Settings>
        {Object.entries(settings).map(([key, val]) => {
          return (
            <Setting key={key}>
              <SettingsBtn onClick={() => toggleSetting(key)}>
                <input type="checkbox" checked={val} onChange={() => {}} />
                <div>{key}</div>
              </SettingsBtn>
            </Setting>
          );
        })}
      </Settings>

      <GraphRow>
        {data.nodes.length && (
          <ForceGraph2D
            ref={graphRef}
            graphData={data}
            cooldownTime={Infinity}
            d3AlphaDecay={0}
            d3VelocityDecay={0}
            width={canvasSize.width}
            height={canvasSize.height}
            backgroundColor=""
            nodeRelSize={5}
            nodeLabel={(node: any) => node.name || ""}
            linkDirectionalParticles={settings.particles ? 3 : 0}
            linkDirectionalParticleWidth={1}
            linkDirectionalParticleSpeed={1.002}
            linkDirectionalArrowLength={settings.arrows ? 1 : 0}
            linkWidth={1}
            linkColor={layoutPreset.colors.white}
            nodeCanvasObject={nodeRenderObject}
            enableZoomPanInteraction={false}
            onNodeDragEnd={() => {
              centerAndFit(graphRef.current, data.nodes);
            }}
          />
        )}
      </GraphRow>
    </Container>
  );
};

export default Graph;
