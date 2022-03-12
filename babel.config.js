const getPlugins = (phase) => {
  if (phase === "production") {
    return ["transform-remove-console"];
  } else {
    return [];
  }
};

module.exports = (api) => {
  const phase = api.cache(() => process.env.NODE_ENV);

  return {
    presets: ["@vue/cli-plugin-babel/preset"],
    plugins: getPlugins(phase),
  };
};
