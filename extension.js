
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
	let disposable4 = vscode.commands.registerCommand('AndroidLauncher.focuswindows', async function () {
		androidController.focusWindows(true)
	});
	let disposable5 = vscode.commands.registerCommand('AndroidLauncher.stopfocuswindows', async function () {
		androidController.focusWindows(false)
	});
	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);
	context.subscriptions.push(disposable3);
	context.subscriptions.push(disposable4);
	context.subscriptions.push(disposable5);

	/*vscode.window.registerTreeDataProvider(
		'android-emulator',
		new AndroidEmulatorProvider(vscode.workspace.rootPath)
	);*/
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
