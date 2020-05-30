// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const cp = require('child_process');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "AndroidLauncher" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('AndroidLauncher.runandroid', async function () {
		// The code you place here will be executed every time your command is executed

		
		//emulator -list-avds
		cp.exec('emulator -list-avds', async (err, stdout, stderr) => {
			console.log('stdout: ' + stdout);
			console.log('stderr: ' + stderr);
			
			if (err) {
				console.log('error: ' + err);
			}
			else{
				const emulatorList = stdout.trim().split('\n');

				if(emulatorList.length == 0){
					vscode.window.showErrorMessage("No Emulators founds. Did you set up any?")
				}
				else if(emulatorList.length == 1 && emulatorList[0] != null || emulatorList[0] != ''){
					const emulator = emulatorList[0]

					launchEmu(emulator);
				}
				else{
					//vscode.window.showWarningMessage('Select your Emulator from list.');
					
					const emulator = await vscode.window.showQuickPick(emulatorList);
					
					launchEmu(emulator);

					
				}

				

				
			}
		});

		/**/
		
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

function launchEmu(emuName){
	cp.exec('emulator -avd '+emuName, (err, stdout, stderr) => {
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (err) {
			console.log('error: ' + err);
			vscode.window.showErrorMessage("Unable to start the emulator "+emuName+"!");
		}
	});

	vscode.window.withProgress({
		location: vscode.ProgressLocation.Notification,
		title: "I am long running!",
		cancellable: true
	}, (progress, token) => {
		token.onCancellationRequested(() => {
			console.log("User canceled the long running operation");
		});

		progress.report({ increment: 0 });

		setTimeout(() => {
			progress.report({ increment: 10, message: "Preparing to Launch "+emuName + "..." });
		}, 1000);

		setTimeout(() => {
			progress.report({ increment: 40, message: "Starting "+emuName+ "..." });
		}, 2000);

		setTimeout(() => {
			progress.report({ increment: 50, message: "Launching in action - almost there..." });
		}, 3000);

		const p = new Promise(resolve => {
			setTimeout(() => {
				resolve();
			}, 5000);
		});

		return p;
	});
}