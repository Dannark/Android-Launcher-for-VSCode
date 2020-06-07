const vscode = require('vscode');
const cp = require('child_process');
const msg = require('./Messages');

function chooseEmulatorToLaunch(){
	cp.exec('emulator -list-avds', async (err, stdout, stderr) => {
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		
		if (err) {
			console.log('error: ' + err);
			if(err.toString().startsWith("Error: Command failed: emulator -list-avds")){
				vscode.window.showErrorMessage(msg.ENVIRONMENT_NOT_CONFIGURED)
			}
			else{
				vscode.window.showErrorMessage(""+ err)
			}
		}
		else{
			const emulatorList = stdout.trim().split('\n');
			
			if(emulatorList){
				if(emulatorList.length > 1){
					const emulator = await vscode.window.showQuickPick(emulatorList);
					if(emulator) launchEmulator(emulator);
					
				}
				else if(emulatorList.length == 1 && emulatorList[0] != null && emulatorList[0] != ''){
					const emulator = emulatorList[0]
					launchEmulator(emulator);
				}
				else{
					vscode.window.showWarningMessage("You have no emulators. Please Create one with the command: 'Create Android Emulator'");
				}
			}
			else{
				vscode.window.showWarningMessage("You have no emulators. Please Create one with the command: 'Create Android Emulator'");
			}
			
			
		}
	});
}

function launchEmulator(emuName){
	cp.exec('emulator -avd '+emuName+' -no-boot-anim', (err, stdout, stderr) => {
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (err) {
			console.log('error: ' + err);
			vscode.window.showErrorMessage("Unable to start the emulator "+emuName+"!");
		}
	});

	vscode.window.withProgress({
		location: vscode.ProgressLocation.Notification,
		title: `Launching emulator ${emuName}...`,
		cancellable: false
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
	vscode.window.withProgress({
		location: vscode.ProgressLocation.Notification,
		title: "Fetching necessary information...",
		cancellable: false
	}, (progress, token) => {
		
		const p = new Promise(resolve => {
			
			cp.exec(`sdkmanager --list`, async (err, stdout, stderr) => {
				console.log('stdout: ' + stdout);
				console.log('stderr: ' + stderr);

				resolve();

				if (err) {
					console.log('error: ' + err);
					vscode.window.showErrorMessage(msg.UNABLE_TO_GET_PACKAGE);
				}
				else{
					const installedPackages = stdout.substr(0, stdout.indexOf('Available Packages:'))
					const avaliablePackages = stdout.substr(stdout.indexOf('Available Packages:'), stdout.indexOf('Available Updates:'))

					const installedTargetList = installedPackages ? installedPackages.trim().split('\n') : []
					let objectArrayInstalledTargetList = installedTargetList.filter((e,i) => {
						return e.trim().startsWith('system-images')
					}).map((e,i) =>{
						const item = e.trim()
						return ({label:item.substring(0,item.indexOf(' ')), detail:'(Installed)'})
					})

					const avaliableTargetList = avaliablePackages? avaliablePackages.trim().split('\n') : []
					let objectArrayAvaliableTargetList = avaliableTargetList.filter((e,i) => {
						return e.trim().startsWith('system-images')
					}).map((e,i) =>{
						const item = e.trim()
						return ({label:item.substring(0,item.indexOf(' ')), description:' - Donwload'})
					})

					const targetList = [...objectArrayInstalledTargetList, ...objectArrayAvaliableTargetList]

					let emuName = (await vscode.window.showInputBox({
						prompt:'Choose a unique name for your emulator',
						placeHolder:'Emulator name...',
						validateInput: text => {
							return text.match(/[^a-zA-Z0-9_]/) || text == '' ? "Invalid Name!" : null;
						}
					}))
					if(emuName != undefined && emuName != null && emuName != ''){
						emuName = emuName.toString().trim().replace(' ','_')

						let target = await vscode.window.showQuickPick(targetList, {placeHolder:'Select your Android Package Image:'})

						if(target != undefined && target.detail == '(Installed)'){
							const sdk_id = `${target.label}`;
							
							if(sdk_id!= undefined){
								const createCommand = `echo no | avdmanager create avd -n ${emuName} -k "${sdk_id}" -f --device "pixel"` //Nexus 4 | pixel
								console.log('criando emulador: ' + createCommand);
								cp.exec(createCommand, async (err, stdout, stderr) => {
									console.log('stdout: ' + stdout);
									console.log('stderr: ' + stderr);
									if (err) {
										console.log('error sdk_id: ' + err);
										vscode.window.showErrorMessage(msg.UNABLE_TO_CREATE_EMULATOR+` ${emuName}!`);
									}
									else{
										vscode.window.showInformationMessage(`Emulator ${emuName} created successfully!`);
									}
								});
							}
						}
						else if(target != undefined &&target.description == ' - Donwload'){
							downloadTargetImage(target.label);
						}
						
						console.log(target);
					}
					else{
						vscode.window.showErrorMessage(`Invalid Name.`);
					}
				}
			});
		});

		return p;
	})
}

async function downloadTargetImage(androidImage){
	vscode.window.withProgress({
		location: vscode.ProgressLocation.Notification,
		title: `Downloading Package... [${androidImage}]`,
		cancellable: false
	}, (progress, token) => {

		const command = `sdkmanager ${androidImage}`

		const p = new Promise(resolve => {
			cp.exec(command, async (err, stdout, stderr) => {
				resolve()

				if (err) {
					console.log('error: ' + err);
					vscode.window.showErrorMessage(msg.UNABLE_TO_DOWNLOAD_PACKAGE);
				}
				else{
					vscode.window.showInformationMessage('Download Finshed.')
					createEmulator()
				}
			});
		});

		return p;
	})
	
}

async function deleteEmulator(){
	cp.exec("emulator -list-avds", async (err, stdout, stderr) => {
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (err) {
			if(err.toString().startsWith("Error: Command failed: emulator -list-avds")){
				vscode.window.showErrorMessage(msg.ENVIRONMENT_NOT_CONFIGURED)
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
						vscode.window.showErrorMessage(msg.EMULATOR_NOT_DELETED)
					}
					else{
						vscode.window.showInformationMessage(`AVD '${emulator}' deleted successfully.`);
					}
				});
			}
		}
	});
}

let enableHotWindownsFocus = false;
let attachedWindowsId = -1
let attachedWindowsRectangle = null
let refocusWindows = null;
let previousFocusedWindowsId = -1;

function focusWindows(canFocus){
	const { windowManager } = require("node-window-manager")

	const window = windowManager.getActiveWindow()

	if(canFocus){
		if(enableHotWindownsFocus == false){
			enableHotWindownsFocus = true
			attachedWindowsId = window.processId
			attachedWindowsRectangle = window.getBounds()
			
			//loop
			refocusWindows = setInterval(() => {
				const currentWindow = windowManager.getActiveWindow();
				if(currentWindow.processId == attachedWindowsId){
					
					const windowsList = windowManager.getWindows()
					windowsList.map((emu,i) => {
						if(emu.getTitle().startsWith('Android Emulator -')){
							
							if (currentWindow.processId != previousFocusedWindowsId
									&& previousFocusedWindowsId != emu.processId) {
								emu.bringToTop()
								currentWindow.bringToTop()
							}
							windowManager.requestAccessibility();
							emu.setBounds({ 
								x: currentWindow.getBounds().x+currentWindow.getBounds().width});
						}
						return;
					})
				}
				previousFocusedWindowsId = currentWindow.processId;
				
			}, 50);
		}
	}
	else{
		enableHotWindownsFocus = false
		clearInterval(refocusWindows)
	}
}

module.exports = {
	chooseEmulatorToLaunch,
	createEmulator,
	deleteEmulator,
	focusWindows
};