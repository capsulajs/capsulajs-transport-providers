module.exports = {
  transform: {
    '\\.ts$': 'ts-jest'
  },
  testRegex: 'tests/.*\\.test\\.ts$',
  moduleFileExtensions: [
    'js',
    'ts'
  ],
  'moduleDirectories': [
    'node_modules',
    'src'
  ]
};
