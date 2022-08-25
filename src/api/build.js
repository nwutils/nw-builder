import NwBuilder from "../../lib/index.cjs";

const build = async () => {
  const nw = new NwBuilder(options);
  nw.build();
};

export default build;
