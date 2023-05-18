export const PACKAGE_JSON_TEMPLATE = `
{
 "name": "@silvermine/eslint-config",
  "version": "0.0.0",
  "description": "JS Code Standards for all SilverMine projects - eslint enforcement",
  "main": "index.js",
  "scripts": {
    "eslint": "eslint '{,!(node_modules|dist)/**/}*.ts'"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/silvermine/eslint-config-silvermine.git"
  },
  "keywords": [
    "eslint",
    "eslintconfig"
  ],
  "author": "Jeremy Thomerson",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/silvermine/eslint-config-silvermine/issues"
  },
  "homepage": "https://github.com/silvermine/eslint-config-silvermine#readme",
  "devDependencies": {}
}
`;
