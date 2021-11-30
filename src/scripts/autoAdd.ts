import * as fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { getFilesCheckedByTs } from '../cli/lib/strictFiles';
import { filterFilesWithStrictComment } from '../cli/lib/strictFilesUtils';
import { compile } from '../cli/lib/compile';
import { TS_STRICT_COMMENT } from '../common/constants';

const addTsStrictCommenToFile = (relativePath: string) => {
  const resolvedPath = path.resolve(relativePath);
  const data = fs.readFileSync(resolvedPath).toString().split('\n');
  data.unshift(`//${TS_STRICT_COMMENT}`);
  const text = data.join('\n');

  fs.writeFileSync(resolvedPath, text);
};

export const main = async () => {
  console.log('Getting files...');
  const files = await getFilesCheckedByTs();

  const allFiles = files
    .map((file) => path.relative('.', file))
    .filter((file) => !file.includes('..'))
    .filter((file) => file.includes('.ts') || file.includes('.tsx'));

  const filesWithTsStrictComment = filterFilesWithStrictComment(allFiles);

  const filesWithoutTsStrictComment = allFiles.filter(
    (file) => !filesWithTsStrictComment.includes(file),
  );

  console.log('Compiling...');
  const errorsMap = await compile();

  const relativeErrorsMap = new Map<string, string[]>();

  for (const [key, value] of errorsMap.entries()) {
    relativeErrorsMap.set(path.relative('.', key), value);
  }

  const filesRemaining = [];

  // Let's try to automatically add //@ts-strict to the top of files without errors
  for (const fileWithoutTsComment of filesWithoutTsStrictComment) {
    // Skip files that had compilation errors
    if (relativeErrorsMap.has(fileWithoutTsComment)) {
      filesRemaining.push(fileWithoutTsComment);
      continue;
    }

    // Otherwise, add the comment
    addTsStrictCommenToFile(fileWithoutTsComment);

    console.log(`✅ - Added strict comment to ${chalk.bold(fileWithoutTsComment)}`);
  }

  console.log({ filesRemaining });
  console.log('Done.');
};
