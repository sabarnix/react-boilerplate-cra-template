import shell from 'shelljs';
import replace from 'replace-in-file';

import { shellEnableAbortOnFail, shellDisableAbortOnFail } from './utils';

interface Options {}

export function crateTemplateFolder(opts: Options = {}) {
  const abortOnFailEnabled = shellEnableAbortOnFail();

  const copyToTemplate = (
    path: string,
    fromRoot: boolean = false,
    isRecursive?: boolean,
    modifyContent?: {
      from: RegExp;
      to: string;
    },
  ) => {
    const p = `template/${path}`;
    if (isRecursive) {
      shell.cp('-r', `${fromRoot ? '../../' : ''}${path}`, p);
    } else {
      shell.cp( `${fromRoot ? '../../' : ''}${path}`, p);
    }
    if (modifyContent) {
      try {
        replace.sync({
          files: p,
          from: modifyContent.from,
          to: modifyContent.to,
        });
      } catch (error) {
        console.error('Couldnt modify content:', error);
      }
    }
  };

  // Clean already generated one
  shell.rm('-rf', 'template');

  shell.mkdir('template');

  // We want only pre-commit hook with custom script excluded
  shell.mkdir('template/.husky');
  copyToTemplate('.husky/pre-commit', true, false, {
    from: /yarn verify-startingTemplate-changes/g,
    to: '',
  });


  copyToTemplate('.vscode', true, true);
  copyToTemplate('public', false, true);
  copyToTemplate('src', false, true);
  copyToTemplate('.babel-plugin-macrosrc.js');
  copyToTemplate('.env.local');
  copyToTemplate('.env.production');
  copyToTemplate('.eslintrc.js');
  copyToTemplate('.gitattributes', true);
  copyToTemplate('.gitignore', true);
  copyToTemplate('.npmrc', true);
  copyToTemplate('.nvmrc', true);
  copyToTemplate('.prettierignore');
  copyToTemplate('.stylelintrc.js');
  copyToTemplate('tsconfig.json');
  copyToTemplate('README.md', true);

  // Rename some specific files so they won't be discarded in 'yarn pack'
  shell.mv('template/.gitignore', 'template/gitignore');
  shell.mv('template/.npmrc', 'template/npmrc');

  if (abortOnFailEnabled) shellDisableAbortOnFail();
}

export function removeTemplateFolder() {
  shell.rm('-rf', 'template');
}
