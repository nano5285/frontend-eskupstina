// webpack.config.js

const path = require("path");

module.exports = {
  entry: "./src/index.js", // Entry point of your application
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory
    filename: "bundle.js", // Output bundle file name
  },
  resolve: {
    fallback: {
      https: require.resolve("https-browserify"),
    },
  },
  module: {
    rules: [
      // Add rules for loading different file types (e.g., JavaScript, CSS, etc.)
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader", // Example loader for JavaScript files
        },
      },
      // Add more rules for other file types as needed
    ],
  },
};
