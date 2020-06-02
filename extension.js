
const vscode = require('vscode');
const cp = require('child_process');
const androidController = require('./src/AndroidController.js');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "AndroidLauncher" is now active!');

	
	let disposable = vscode.commands.registerCommand('AndroidLauncher.runandroid', async function () {
		androidController.chooseEmulatorToLaunch()
	});

	let disposable2 = vscode.commands.registerCommand('AndroidLauncher.createandroid', async function () {
		androidController.createEmulator();
	});
	let disposable3 = vscode.commands.registerCommand('AndroidLauncher.deleteandroid', async function () {
		androidController.deleteEmulator();
	});
	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);
	context.subscriptions.push(disposable3);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
