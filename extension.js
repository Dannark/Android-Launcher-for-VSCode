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
				if(err.toString().startsWith("Error: Command failed: emulator -list-avds")){
					vscode.window.showErrorMessage(`You haven't configured your environment variables ANDROID_HOME or ANDROID_SDK_HOME correctly in your system.`
					+` Please refer this to: https://stackoverflow.com/questions/23042638/how-do-i-set-android-sdk-home-environment-variable`)
				}
				else{
					vscode.window.showErrorMessage(""+ err)
				}
			}
			else{
				const emulatorList = stdout.trim().split('\n');

				if(emulatorList.length == 0){
					vscode.window.showErrorMessage("No Emulators founds. Did you set up any?")
				}
				else if(emulatorList.length == 1 && emulatorList[0] != null || emulatorList[0] != ''){
					const emulator = emulatorList[0]

					launchEmulator(emulator);
				}
				else{
					//vscode.window.showWarningMessage('Select your Emulator from list.');
					
					const emulator = await vscode.window.showQuickPick(emulatorList);
					
					launchEmulator(emulator);

					
				}

				

				
			}
		});

		/**/
		
	});

	let disposable2 = vscode.commands.registerCommand('AndroidLauncher.createandroid', async function () {
		createEmulator();
	});
	let disposable3 = vscode.commands.registerCommand('AndroidLauncher.androidlist', async function () {
		getListOfEmulators();
	});
	let disposable4 = vscode.commands.registerCommand('AndroidLauncher.deleteandroid', async function () {
		deleteEmulator();
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);
	context.subscriptions.push(disposable3);
	context.subscriptions.push(disposable4);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

function launchEmulator(emuName){
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

async function createEmulator(){
	//GET A LIST OF TARGETS
	cp.exec(`sdkmanager --list`, async (err, stdout, stderr) => {
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (err) {
			console.log('error: ' + err);
			vscode.window.showErrorMessage(`Unable to get the list of targets. Did you configured your android environment variables?`);
		}
		else{
			const installedPackages = stdout.substr(0, stdout.indexOf('Available Packages:'));
			
			if(installedPackages == undefined || installedPackages == null || installedPackages.length == 0){
				vscode.window.showErrorMessage(`You don't have any Android Images in your computer, Please download them in AVD Manager from Android Studio.`);
			}
			else{
				let targetList = installedPackages.trim().split('\n');
			
				targetList = targetList.filter((e,i) => {
					return e.trim().startsWith('system-images')
				}).map((e,i) =>{
					const item = e.trim();
					return item.substring(0,item.indexOf(' '))
				})

				let emuName = (await vscode.window.showInputBox({placeHolder:'Enter with the emulator name...'})).toString().trim().replace(' ','_')
				if(emuName != undefined && emuName != null && emuName != ''){
					emuName = emuName.toString().trim().replace(' ','_')

					let target = await vscode.window.showQuickPick(targetList, {placeHolder:'Select the image to create:'})
					const sdk_id = `${target}`;

					if(sdk_id!= undefined){
						const createCommand = `echo no | avdmanager create avd -n ${emuName} -k "${sdk_id}" -f`
						cp.exec(createCommand, async (err, stdout, stderr) => {
							console.log('stdout: ' + stdout);
							console.log('stderr: ' + stderr);
							if (err) {
								console.log('error sdk_id: ' + err);
								vscode.window.showErrorMessage(`Unable to create the emulator ${emuName}!`);
							}
							else{
								vscode.window.showInformationMessage(`Emulator ${emuName} created sucesfully!`);
							}
						});
						console.log("end of script: "+createCommand)
					}
					
				}
				else{
					vscode.window.showErrorMessage(`Invalid Name.`);
				}

			}
		}
	});

}

async function getListOfEmulators(){
	cp.exec("emulator -list-avds", async (err, stdout, stderr) => {
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (err) {
			if(err.toString().startsWith("Error: Command failed: emulator -list-avds")){
				vscode.window.showErrorMessage(`You haven't configured your environment variables ANDROID_HOME or ANDROID_SDK_HOME correctly in your system.`
				+` Please refer this to: https://stackoverflow.com/questions/23042638/how-do-i-set-android-sdk-home-environment-variable`)
			}
			else{
				vscode.window.showErrorMessage(""+ err)
			}
		}
		else{
			const emulatorList = stdout.trim().split('\n');
			const emulator = await vscode.window.showQuickPick(emulatorList);
		}
	});
}

async function deleteEmulator(){
	cp.exec("emulator -list-avds", async (err, stdout, stderr) => {
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (err) {
			if(err.toString().startsWith("Error: Command failed: emulator -list-avds")){
				vscode.window.showErrorMessage(`You haven't configured your environment variables ANDROID_HOME or ANDROID_SDK_HOME correctly in your system.`
				+` Please refer this to: https://stackoverflow.com/questions/23042638/how-do-i-set-android-sdk-home-environment-variable`)
			}
			else{
				vscode.window.showErrorMessage(""+ err)
			}
		}
		else{
			const emulatorList = stdout.trim().split('\n');
			const emulator = await vscode.window.showQuickPick(emulatorList, {placeHolder:'Select the Emulator to be DELETED.'});

			if(emulator != undefined){
				cp.exec(`avdmanager delete avd -n ${emulator}`, async (err, stdout, stderr) => {
					console.log('stdout: ' + stdout);
					console.log('stderr: ' + stderr);
					if (err) {
						vscode.window.showErrorMessage("Ops! The emulator selected could not be deleted.")
					}
					else{
						vscode.window.showInformationMessage(`AVD '${emulator}' deleted successfully.`);
					}
				});
			}
		}
	});
}