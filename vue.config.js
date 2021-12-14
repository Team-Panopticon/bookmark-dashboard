module.exports = {
  filenameHashing: false,
  chainWebpack: (config) => {
    config.optimization.delete("splitChunks");
  },
  configureWebpack: (config) => {
    config.output.filename = "[name].js";
    config.devtool = "cheap-module-source-map";
  },
  pages: {
    popup: {
      entry: "src/popup/main.ts",
      output: {
        filename: "popup.js",
      },
      template: "public/popup.html",
      filename: "popup.html",
      title: "Popup",
    },
    index: {
      entry: "src/main.ts",
      output: {
        filename: "index.js",
      },
      template: "public/index.html",
      filename: "index.html",
      title: "Bookmark-dashboard",
    },
    newtab: {
      entry: "src/newtab/main.ts",
      output: {
        filename: "newtab.js",
      },
      template: "public/newtab.html",
      filename: "newtab.html",
      title: "Bookmark Dashboard",
    },
  },
};
