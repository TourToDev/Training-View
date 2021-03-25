const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let mode = "development";

if (process.env.NODE_ENV === "production") {
    mode = production;
}

module.exports = {
    mode: mode,
    devServer: {
        contentBase: "./dist",
        hot: true,
        proxy: {
            '/user': 'http://localhost:3000',
          },
    },
    devtool: "source-map",
    module:{
        rules:[
            {
                test: /\.less$/i,
                use: [
                    {
                    loader: "style-loader",
                    },
                    {
                    loader: "css-loader",
                    },
                    {
                    loader: "less-loader",
                    options: {
                        lessOptions: {
                        strictMath: true,
                        },
                    },
                    },
                ],
            },

            {
                test:/.s?css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader","sass-loader"],
            },
            
            {
                test:/.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                }
            }
        ]
    },
    plugins:[new MiniCssExtractPlugin()],
};