const fs = require('fs');
const ts = require('typescript');

const content = fs.readFileSync('./src/components/layout/Navbar.tsx', 'utf8');

const sourceFile = ts.createSourceFile(
  'Navbar.tsx',
  content,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX
);

const syntaxErrors = [];

function checkNodes(node) {
  // If a node has a width of 0, it might be a missing token
  if (node.kind === ts.SyntaxKind.JsxElement) {
    if (node.closingElement.tagName.text !== node.openingElement.tagName.text) {
      const lineAndChar = sourceFile.getLineAndCharacterOfPosition(node.getStart());
      console.log(`Mismatched tag at line ${lineAndChar.line + 1}: <${node.openingElement.tagName.text}> closed by </${node.closingElement.tagName.text}>`);
    }
  }
  ts.forEachChild(node, checkNodes);
}

function traverseAndFindErrors(node) {
    // Collect parse diagnostics if any
}

// In typescript parser, parse errors are stored in the sourceFile
const diagnostics = sourceFile.parseDiagnostics;
if (diagnostics && diagnostics.length > 0) {
  diagnostics.forEach(diag => {
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(diag.start);
    console.log(`Error at line ${line + 1}, char ${character + 1}: ${diag.messageText}`);
  });
} else {
  console.log("No syntax errors found by TypeScript parser!");
}
