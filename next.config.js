// next.config.js
const withSass = require('@zeit/next-sass')
const webpack = require('webpack')
const path = require('path')
module.exports = withSass({
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[local]___[hash:base64:5]",
  },
  sassLoaderOptions: {
    data: `
      @import './assets/styles/variables.scss';
    `
  },
  webpack: config => {
    config.module.rules.forEach(rule => {
      if (rule.test.toString().includes('.scss')) {
        rule.rules = rule.use.map(useRule => {
          if (typeof useRule === 'string') {
            return { loader: useRule }
          }

          if (useRule.loader.startsWith('css-loader')) {
            return {
              oneOf: [
                {
                  test: new RegExp('.scss$'),
                  resourceQuery: /^\?raw$/,
                  loader: useRule.loader,
                  options: { ...useRule.options, modules: false },
                },
                {
                  loader: useRule.loader,
                  options: useRule.options,
                },
              ],
            }
          }

          return useRule
        })

        delete rule.use
      }
    })
    config.module.rules.push({
      test: /\.txt$/i,
      use: 'raw-loader'
    })
    config.module.rules.push({
      test: /\.(eot|woff|woff2|ttf|png|jpg|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
          name: '[name].[ext]'
        }
      }
    })
    config.module.rules.push({
      test: /\.svg$/,
      use: 'svg-inline-loader'
    })
    config.plugins.push(
      new webpack.ContextReplacementPlugin(
        new RegExp('/highlight.js/lib/languages$/'),
        new RegExp(`^./(javascript)$`)
      )
    )
    return config
  }
})