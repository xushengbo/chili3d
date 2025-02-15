const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
    entry: {
        main: "./packages/chili-web/src/index.ts",
    },
    module: {
        rules: [
            {
                test: /\.wasm$/,
                type: "asset",
            },
            {
                test: /\.cur$/,
                type: "asset",
            },
        ],
    },
    builtins: {
        copy: {
            patterns: [
                {
                    from: "./public",
                    globOptions: {
                        ignore: ["**/**/index.html"],
                    },
                },
            ],
        },
        html: [
            {
                template: "./public/index.html",
                inject: "body",
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        fallback: {
            fs: false,
            perf_hooks: false,
            os: false,
            crypto: false,
            stream: false,
            path: false,
        },
    },
    plugins: [new ForkTsCheckerWebpackPlugin()],
    output: {
        filename: "[contenthash].bundle.js",
        path: path.resolve(__dirname, "build"),
    },
};
