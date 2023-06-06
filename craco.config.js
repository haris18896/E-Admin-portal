const path = require('path')

module.exports = {
  reactScriptsVersion: 'react-scripts',
  style: {
    sass: {
      loaderOptions: {
        sassOptions: {
          includePaths: ['node_modules', 'src/assets']
        }
      }
    },
    postcss: {
      plugins: [require('postcss-rtl')()]
    }
  },
  webpack: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@views': path.resolve(__dirname, 'src/views'),
      '@store': path.resolve(__dirname, 'src/redux'),
      '@styles': path.resolve(__dirname, 'src/@core/scss'),
      '@configs': path.resolve(__dirname, 'src/configs'),
      '@utils': path.resolve(__dirname, 'src/utility/Utils'),
      '@assets': path.resolve(__dirname, 'src/@core/assets'),
      '@hooks': path.resolve(__dirname, 'src/utility/hooks'),
      '@layouts': path.resolve(__dirname, 'src/@core/layouts'),
      '@editor': path.resolve(__dirname, 'src/components/editor'),
      '@search': path.resolve(__dirname, 'src/components/search'),
      '@popover': path.resolve(__dirname, 'src/components/popover'),
      '@customComponents': path.resolve(__dirname, 'src/components'),
      '@components': path.resolve(__dirname, 'src/@core/components'),
      '@FileUploader': path.resolve(__dirname, 'src/components/fileUploader'),
      '@select': path.resolve(__dirname, 'src/components/formGroup/Select.js'),
      '@spinner': path.resolve(__dirname, 'src/components/spinner/Spinner.js'),
      '@status': path.resolve(
        __dirname,
        'src/components/status'
      ),
      '@ScreenComponent': path.resolve(
        __dirname,
        'src/components/screen.components'
      ),
      '@pagination': path.resolve(__dirname, 'src/components/pagination'),
      '@FormIconField': path.resolve(
        __dirname,
        'src/components/formGroup/FormIconField.js'
      ),
      '@ReactSelectStyles': path.resolve(
        __dirname,
        'src/components/formGroup/select-styling'
      ),
      '@FormGroupElement': path.resolve(
        __dirname,
        'src/components/formGroup/FormGroupElement'
      )
    }
  }
}
