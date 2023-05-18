import path from 'path';
import { mkdir, rm, writeFile, cp, readdir } from 'fs/promises';
import _ from 'underscore';
import { spawnAsync } from './utilities/spawn-async';
import { SUPPORTED_DEPENDENCY_VERSION_MAP } from './supported-versions';
import { PACKAGE_JSON_TEMPLATE } from './templates/package.json.tpl';
import { TSCONFIG_TEMPLATE } from './templates/tsconfig.json.tpl';
import { ESLINT_RC_CONFIG } from './templates/eslintrc.tpl';

const versionsDir = path.join(__dirname, 'versions');

function compilePackageJsonTemplateFile(config: {
   esLintVersion: string;
   typeScriptVersion: string;
   typeScriptEslintVersion: string;
}): string {
   const compiledPackageJson = _.template(PACKAGE_JSON_TEMPLATE);

   return compiledPackageJson(config);
}

async function scaffoldTestDirectories(): Promise<void> {
   try {
      console.info('Checking for existing version directory.');

      await rm(versionsDir, {
         recursive: true,
      });
   } catch(_e) {
      console.info('Directory could not be removed or does not exist. Continuing.');
   }

   await Promise.all(SUPPORTED_DEPENDENCY_VERSION_MAP.map(async (versionSet) => {
      const versionDir = path.join(
         versionsDir,
         `eslint_${versionSet.eslint}_ts_${versionSet.typeScriptVersion}_tseslint_${versionSet.typeScriptEslintVersion}`
      );

      console.info(`Scaffolding project directory ${versionDir}`);

      try {
         await mkdir(versionDir, { recursive: true });
      } catch(e) {
         console.error('Could not create directory', e);
         return;
      }

      process.chdir(versionDir);

      try {
         console.info('Generating templates');

         const file = compilePackageJsonTemplateFile({
            esLintVersion: versionSet.eslint,
            typeScriptVersion: versionSet.typeScriptVersion,
            typeScriptEslintVersion: versionSet.typeScriptEslintVersion,
         });

         await writeFile(`${versionDir}/package.json`, file);

         console.info('Generating tsconfig.json');

         await writeFile(`${versionDir}/tsconfig.json`, TSCONFIG_TEMPLATE);

         console.info('Generating .eslintrc');

         await writeFile(`${versionDir}/.eslintrc`, ESLINT_RC_CONFIG);
      } catch(e) {
         console.error('Could not copy templates:', e);
         return;
      }

      try {
         const projectRootFiles = [
            'index.js',
            'browser.js',
            'node.js',
            'node-tests.js',
            'vue2.js',
            'partials',
         ];

         const testCasesDirectory = `${__dirname}/test-cases`;

         const files = await readdir(testCasesDirectory);

         console.info(`Copying files from project root: ${projectRootFiles.join(', ')}`);

         await Promise.all(projectRootFiles.map(async (file) => {
            await cp(path.resolve(__dirname, '..', file), `${versionDir}/${file}`, {
               recursive: true,
            });
         }));

         console.info(`Copying test cases: ${files.join(', ')}`);

         await Promise.all(files.map(async (file) => {
            await cp(`${testCasesDirectory}/${file}`, `${versionDir}/${file}`);
         }));
      } catch(e) {
         console.error('Could not create directory', e);
         return;
      }

      try {
         await spawnAsync(versionDir, 'npm', [ 'install' ]);
      } catch(error) {
         console.error(`Error installing dependencies versionSet: ${versionSet}:`, error);
      }

      try {
         await spawnAsync(versionDir, 'npm', [ 'run', 'eslint' ]);
      } catch(error) {
         console.error(`Error running linting for versionSet: ${versionSet}:`, error);
      }

      process.chdir(__dirname);
   }));
}

(async () => {
   await scaffoldTestDirectories();
})();
