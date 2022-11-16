const webpack = require("webpack")
const path = require("path")
const NpmDtsPlugin = require("npm-dts-webpack-plugin")
const process = require("process")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const WebpackManifestPlugin =
	require("webpack-manifest-plugin").WebpackManifestPlugin

module.exports = function override(config, env) {
	const fallback = config.resolve.fallback
		? {
				...config.resolve.fallback,
				crypto: require.resolve("crypto-browserify"),
		  }
		: { crypto: require.resolve("crypto-browserify") }

	const outDir = "./build"
	config.target = "web"
	config.entry = { app: "./src/KycDaoClient.ts", iframeClient: "./src/KycDaoIframeClient.ts", }
	config.output = {
		filename: "[name].js",
		library: { name: "@kycdao/kycdao-web-sdk", type: "umd" },
	}

	config.output.path = path.resolve(outDir)
	config.resolve.fallback = fallback

	config.plugins = (config.plugins || []).concat([
		new webpack.ProvidePlugin({
			process: "process/browser",
			Buffer: ["buffer", "Buffer"],
			ethereum: ["ethereum", "ethereum"],
			//            crypto: ['crypto', 'crypto-browserify']
		}),
	])

	config.module.rules.unshift({
		test: /\.(woff2?)$/,
		dependency: { not: ["file"] },
		type: "asset/resource",
		generator: {
			// filename: 'static/[name][ext]',
			// emit: false
		},
	})

	if (env === "production") {
		if (process.env.NODE_ENV !== "development") {
			config.plugins.push(new NpmDtsPlugin())
		}
	}

	//missing sourcemaps
	config.ignoreWarnings = [/Failed to parse source map/]

	config.plugins.splice(
		config.plugins.findIndex(
			(plugin) => plugin instanceof MiniCssExtractPlugin
		),
		1
	)

	config.plugins.splice(
		config.plugins.findIndex(
			(plugin) => plugin instanceof WebpackManifestPlugin
		),
		1
	)

	config.plugins.push(
		new MiniCssExtractPlugin({
			filename: "[name].css",
		})
	)

	/*config.plugins.push(
		new WebpackManifestPlugin({
			fileName: "asset-manifest.json",
			publicPath: "public",
			generate: (seed, files, entrypoints) => {
				const manifestFiles = files.reduce((manifest, file) => {
					manifest[file.name] = file.path
					return manifest
				}, seed)
				const entrypointFiles = entrypoints.main.filter(
					// <--- This line here
					(fileName) => !fileName.endsWith(".map")
				)

				return {
					files: manifestFiles,
					entrypoints: entrypointFiles,
				}
			},
		})
	)*/

	config.devtool = "source-map"

	return config
}
