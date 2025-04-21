module.exports = {
  input: [
    'src/**/*.{js,jsx,ts,tsx}'
  ],
  output: './',
  options: {
    lngs: ['en', 'es'],
    ns: ['translation'],
    defaultLng: 'en',
    defaultNs: 'translation',
    resource: {
      loadPath: 'src/locales/{{lng}}/{{ns}}.json',
      savePath: 'src/locales/{{lng}}/{{ns}}.json',
      jsonIndent: 2,
    },
    interpolation: {
      prefix: '{{',
      suffix: '}}'
    },
    removeUnusedKeys: false,
    func: {
      list: ['t'],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }
  }
}
