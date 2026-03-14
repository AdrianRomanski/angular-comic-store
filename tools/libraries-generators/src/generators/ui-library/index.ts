import {
  Tree,
  formatFiles,
  generateFiles,
  names,
  joinPathFragments,
  addDependenciesToPackageJson,
  installPackagesTask,
} from '@nx/devkit';
import { libraryGenerator } from '@nx/angular/generators';
import { UiLibraryGeneratorSchema } from './schema';

interface NormalizedOptions {
  name: string;
  scope: string;
  fileName: string;
  className: string;
  directory: string;
  projectName: string;
}

function normalizeOptions(options: UiLibraryGeneratorSchema): NormalizedOptions {
  const scope = options.scope ?? 'shared';
  const { fileName, className } = names(options.name);
  const directory = `libs/ui/${fileName}`;
  const projectName = `ui-${fileName}`;

  return { name: options.name, scope, fileName, className, directory, projectName };
}

function deleteRecursive(tree: Tree, dirPath: string): void {
  tree.children(dirPath).forEach((child) => {
    const childPath = joinPathFragments(dirPath, child);
    if (tree.isFile(childPath)) {
      tree.delete(childPath);
    } else {
      deleteRecursive(tree, childPath);
    }
  });
}

function removeDefaultComponentFiles(tree: Tree, opts: NormalizedOptions): void {
  const defaultComponentDir = joinPathFragments(
    opts.directory, 'src', 'lib', `ui-${opts.fileName}`
  );

  if (tree.exists(defaultComponentDir)) {
    deleteRecursive(tree, defaultComponentDir);
  }
}

function createComponentFiles(tree: Tree, opts: NormalizedOptions): void {
  const componentDir = joinPathFragments(opts.directory, 'src', 'lib', opts.fileName);

  generateFiles(tree, joinPathFragments(__dirname, 'files'), componentDir, {
    fileName: opts.fileName,
    className: opts.className,
    tmpl: '',
  });
}

function patchTestSetup(tree: Tree, opts: NormalizedOptions): void {
  const testSetupPath = joinPathFragments(opts.directory, 'src', 'test-setup.ts');

  if (tree.exists(testSetupPath)) {
    const content = tree.read(testSetupPath, 'utf-8')!;
    if (!content.includes('vitest-canvas-mock')) {
      tree.write(
        testSetupPath,
        content.replace(
          "import '@angular/compiler';",
          "import '@angular/compiler';\nimport 'vitest-canvas-mock';"
        )
      );
    }
  }
}

function updateBarrelExport(tree: Tree, opts: NormalizedOptions): void {
  const indexPath = joinPathFragments(opts.directory, 'src', 'index.ts');

  tree.write(
    indexPath,
    [
      `export { ${opts.className}Component } from './lib/${opts.fileName}/${opts.fileName}.component';`,
      `export { ${opts.className}ComponentHarness } from './lib/${opts.fileName}/${opts.fileName}.component.harness';`,
      '',
    ].join('\n')
  );
}

export default async function uiLibraryGenerator(
  tree: Tree,
  options: UiLibraryGeneratorSchema
) {
  const opts = normalizeOptions(options);

  await libraryGenerator(tree, {
    directory: opts.directory,
    name: `ui-${opts.fileName}`,
    importPath: `@angular-comic-store/ui-${opts.fileName}`,
    prefix: 'ui',
    standalone: true,
    style: 'scss',
    changeDetection: 'OnPush',
    displayBlock: true,
    flat: false,
    skipTests: true,
    skipModule: true,
    tags: `type:ui,scope:${opts.scope}`,
  });

  removeDefaultComponentFiles(tree, opts);
  createComponentFiles(tree, opts);
  patchTestSetup(tree, opts);
  updateBarrelExport(tree, opts);

  addDependenciesToPackageJson(
    tree,
    { '@angular/cdk': '~21.1.0' },
    { 'vitest-axe': '^1.0.0-pre.5', 'vitest-canvas-mock': '^1.1.0' }
  );

  await formatFiles(tree);

  return () => {
    installPackagesTask(tree);
  };
}
