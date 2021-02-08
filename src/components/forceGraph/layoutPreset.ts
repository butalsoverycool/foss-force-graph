interface Layout {
  width: number;
  height: number;
  fontSizes: number[];
  colors: {
    [key: string]: string;
  };
}

const layoutPreset: Layout = {
  width: 400,
  height: 400,
  fontSizes: [12, 10, 8],
  colors: {
    blue: "#0F42C7",
    lightBlue: "#466dd4",
    white: "#fff",
    black: "#000",
    background: "none",
    link: "rgba(15, 66, 199, 0.2)",
  },
};

export default layoutPreset;
