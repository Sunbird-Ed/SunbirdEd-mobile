import Ast from "ts-simple-ast";
import { SourceFile, Scope } from "ts-simple-ast";
import parser = require('xml-parser');

const ast = new Ast();

const configFile = ast.addExistingSourceFile("../../config.xml");

let configContent: parser.Document = parser(configFile.getFullText());

ast.removeSourceFile(configFile);

const appVersion = configContent.root.attributes.version;

let [major, minor, patch] = appVersion.split(".");

let appMajor = +major;
let appMinor = +minor;
let appPatch = +patch;

ast.addExistingSourceFiles("../../src/pages/*/*/*{.d.ts,.ts,.json}");


const allSources = ast.getSourceFiles();

let moduleArray = new Array<SourceFile>();
let pageArray = new Array<SourceFile>();
let moduleNameArray = new Array<String>();
let pageNameArray = new Array<String>();


allSources.forEach(element => {
  if (element.getSourceFile().getBaseName() == 'manifest.json') {
    let manifest = JSON.parse(element.getText());

    let [major, minor, patch] = manifest.appVersion.split(".");

    let pluginMajor = +major;
    let pluginMinor = +minor;
    let pluginPatch = +patch;

    if (appMajor === pluginMajor && appMinor === pluginMinor && appPatch === pluginPatch) {
      const directory = element.getSourceFile().getDirectory().getSourceFiles().forEach(file => {
        if (file.getSourceFile().getClass(manifest.module) !== undefined) {
          moduleArray.push(file.getSourceFile());
          moduleNameArray.push(manifest.module);
        }

        if (file.getSourceFile().getClass(manifest.main) != undefined) {
          pageArray.push(file.getSourceFile());
          pageNameArray.push(manifest.main);
        }
      });
    }
  }
})

// Create plugin.service.gen.ts file
let pluginServiceFile = ast.addSourceFileIfExists("../../src/app/plugins.service.ts");

if (pluginServiceFile != undefined) {
  pluginServiceFile.deleteSync();
}

pluginServiceFile = ast.createSourceFile("../../src/app/plugins.service.ts");


// Create PluginService class

const pluginClassDec = pluginServiceFile.addClass({
  name: "PluginService",
  isExported: true,
  decorators: [{
    name: "Injectable",
    arguments: []
  }]
});


pluginClassDec.addConstructor({
  parameters: [{
    name: "container",
    type: "ContainerService",
    scope: Scope.Private,
  }]
})


pluginClassDec.addMethod({
  name: "loadAllPlugins",
  bodyText: (writer => {
    pageNameArray.forEach(page => {
      writer.writeLine(page + ".prototype.init(this.container);")
    });
  })
})


pluginClassDec.addMethod({
  name: "getAllPluginModules",
  isStatic: true,
  returnType: "Array<any>",
  bodyText: (writer => {
    writer.writeLine("let modules = [" + moduleNameArray.join(",") + "];");
    writer.writeLine("return modules;");
  })
})

// Adding Imports

pluginServiceFile.addImportDeclaration({
  namedImports: [{
    name: "Injectable"
  }],
  moduleSpecifier: "@angular/core"
});

pluginServiceFile.addImportDeclaration({
  namedImports: [{
    name: "ContainerService"
  }],
  moduleSpecifier: "../framework/"
})

for (var i = 0; i < moduleArray.length; i++) {
  const sourceFile = moduleArray[i]
  const importFile: string = moduleNameArray[i] as string;
  const moduleRelativePath: string = pluginServiceFile.getRelativePathToSourceFileAsModuleSpecifier(sourceFile);

  pluginServiceFile.addImportDeclaration({
    namedImports: [{
      name: importFile
    }],
    moduleSpecifier: moduleRelativePath
  });

}


for (var i = 0; i < pageArray.length; i++) {
  const sourceFile = pageArray[i]
  const importFile: string = pageNameArray[i] as string;
  const moduleRelativePath: string = pluginServiceFile.getRelativePathToSourceFileAsModuleSpecifier(sourceFile);

  pluginServiceFile.addImportDeclaration({
    namedImports: [{
      name: importFile
    }],
    moduleSpecifier: moduleRelativePath
  });

}

pluginServiceFile.formatText();

console.log(pluginServiceFile.getText());

pluginServiceFile.saveSync();
