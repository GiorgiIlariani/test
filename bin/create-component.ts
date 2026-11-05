const { prompt: normalPrompt, MultiSelect, Select } = require('enquirer');
const fs = require('fs');
const pathImport = require('path');
const getPath = (path: string) => pathImport.join(`${__dirname}/../`, path);

type FileTypes = 'story' | 'type' | 'tsx' | 'hook';

type Result = {
  componentName: string;
  files: FileTypes[];
  folder: string;
  newFolder?: string;
};

let result: Result | {} = {};

function getDirectories(path: string) {
  return fs.readdirSync(path).filter(function (file: File) {
    return fs.statSync(path + '/' + file).isDirectory();
  });
}

function firstLower(lower: string) {
  return (lower && lower[0].toLowerCase() + lower.slice(1)) || lower;
}

(async () => {
  const componentsDirectory = getDirectories('components');

  const promptFinishHandler = async (result: Result) => {
    if (result.folder === 'icons') {
      createComponentInIcons(result);
    } else {
      if (result.newFolder) {
        createNewParentFolder(result);
      } else {
        createComponentFolder(result);
      }
    }
  };

  const multiSelectPrompt = new MultiSelect({
    name: 'value',
    message: 'Chose what kind of files you need? (select by pressing space and confirm with enter)',
    required: true,
    initial: ['tsx'],
    choices: [
      { name: 'story', value: 'story' },
      { name: 'type', value: 'type' },
      { name: 'hook', value: 'hook' },
      { name: 'tsx', value: 'tsx' },
    ],
  });

  const folderPrompt = new Select({
    name: 'folder',
    message: 'Pick a folder for component',
    choices: [...componentsDirectory, 'new'],
    required: true,
  });

  const componentNameResponse = await normalPrompt({
    type: 'input',
    name: 'componentName',
    message: 'What is the name of component',
    required: true,
  });

  result = {
    ...result,
    ...componentNameResponse,
  };

  const folderPromptResponse = await folderPrompt.run();
  if (folderPromptResponse === 'new') {
    const newFolder = await normalPrompt({
      type: 'input',
      name: 'newFolder',
      message: 'What is the name of new folder',
      required: true,
    });
    result = {
      ...result,
      ...newFolder,
    };
  } else {
    result = {
      ...result,
      folder: folderPromptResponse,
    };
  }
  if ((result as Result).folder !== 'icons') {
    const filesPrompt = await multiSelectPrompt.run();
    result = {
      ...result,
      files: filesPrompt,
    };
  }
  promptFinishHandler(result as Result);
})();

const getFileName = (file: FileTypes, fileName: string) => {
  switch (file) {
    case 'hook':
      return `use${fileName}.ts`;
      break;
    case 'tsx':
      return `${fileName}.tsx`;
      break;
    case 'story':
      return `${fileName}.stories.tsx`;
      break;
    case 'type':
      return `types.ts`;
      break;
    default:
      break;
  }
};

const getFileContent = (file: FileTypes, fileName: string, folder: string, files: FileTypes[]) => {
  const includesHook = files.includes('hook');
  const includesTypeModule = files.includes('type');
  switch (file) {
    case 'hook':
      return `export const use${fileName} = () => {\n  return {};\n};\n`;
      break;
    case 'tsx':
      return `${
        folder !== 'icons' && includesTypeModule ? "import { Props } from './types';\n" : ''
      }import React from 'react';\n${
        includesHook ? `import { use${fileName} } from './use${fileName}';` : ''
      }\nconst ${fileName}: React.FC<${
        folder !== 'icons' && includesTypeModule ? 'Props' : '{}'
      }> = (props) => {\n  console.info(props);\n${
        includesHook ? `  const {} = use${fileName}();\n` : ''
      }  return <div>${fileName}</div>;\n};\n\nexport default ${fileName};\n`;
      break;
    case 'story':
      return `import { ComponentMeta, ComponentStory } from '@storybook/react';\nimport ${fileName} from './${fileName}';\n\nexport default {\n  component: ${fileName},\n  title: '${folder}/${fileName}',\n} as ComponentMeta<typeof ${fileName}>;\n\nconst Template: ComponentStory<typeof ${fileName}> = (args) => {\n  return <${fileName} {...args} />;\n};\n\nexport const ${firstLower(
        fileName,
      )} = Template.bind({});\n`;
      break;
    case 'type':
      return 'export type Props = {};\n';
      break;
    default:
      break;
  }
};

const createComponentInIcons = (result: Result) => {
  const folderPath = getPath(`components/${result.folder}/`);
  const filePath = `${folderPath}${getFileName('tsx', result.componentName)}`;
  const fileContent = getFileContent('tsx', result.componentName, result.folder, []);
  fs.writeFile(filePath, fileContent, function (err: any) {
    if (err) throw err;
    console.info(`${filePath} done ٩(◕‿◕｡)۶`);
  });
  fs.appendFile(
    `${folderPath}index.ts`,
    `export { default as ${result.componentName} } from './${result.componentName}';\n`,
    function (err: any) {
      if (err) throw err;
      console.info('add export in parent directory done ٩(◕‿◕｡)۶');
    },
  );
};

const createComponentFolder = async (result: Result) => {
  const folderPath = getPath(`components/${result.folder}/`);
  fs.mkdirSync(`${folderPath}${result.componentName}`);
  result.files.map((fileType) => {
    const filePath = `${folderPath}${result.componentName}/${getFileName(
      fileType,
      result.componentName,
    )}`;
    const fileContent = getFileContent(fileType, result.componentName, result.folder, result.files);
    fs.writeFile(filePath, fileContent, function (err: any) {
      if (err) throw err;
      console.info(`${filePath} done ٩(◕‿◕｡)۶`);
    });
  });

  fs.writeFile(
    `${folderPath}${result.componentName}/index.ts`,
    `export { default as ${result.componentName} } from './${result.componentName}';\n`,
    function (err: any) {
      if (err) throw err;
      console.info(`index file for component done ٩(◕‿◕｡)۶`);
    },
  );
  fs.appendFile(
    `${folderPath}index.ts`,
    `export * from './${result.componentName}';\n`,
    function (err: any) {
      if (err) throw err;
      console.info('add export in parent directory done ٩(◕‿◕｡)۶');
    },
  );
};

const createNewParentFolder = async (result: Result) => {
  const folderPath = getPath(`components/${result.newFolder}`);
  fs.mkdirSync(`${folderPath}`);
  fs.appendFile(
    `components/index.ts`,
    `export * from './${result.newFolder}';\n`,
    function (err: any) {
      if (err) throw err;
      console.info('add export in parent directory done ٩(◕‿◕｡)۶');
    },
  );
  result.folder = result.newFolder!;
  createComponentFolder(result);
};
