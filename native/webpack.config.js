const webpack = require("@nativescript/webpack");
const path = require("path");

module.exports = (env) => {
  webpack.init(env);

  // Resolve the @myapp/shared alias
  webpack.chainWebpack((config) => {
    config.resolve.alias.set(
      "@myapp/shared",
      path.resolve(__dirname, "../shared/src")
    );

    config.resolve.alias.set("@", path.resolve(__dirname, "app"));
  });

  return webpack.resolveConfig();
};
