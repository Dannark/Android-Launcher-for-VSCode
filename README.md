# Android Emulator Launcher 

An Extension for VSCode to help you in your Android Development. This allow you to start and Emulator more easily.
This extension is published at: https://marketplace.visualstudio.com/items?itemName=Dannark.AndroidLauncher

## Instructions

To Launch your prefered emulator, press `Ctrl + Shift + P` and search for the command `Run Android Emulator` then press `Enter`. The list of avaliable emulator will show up on the screen, just select the one you want.

![print](https://user-images.githubusercontent.com/7622553/83316815-94e4a900-a1fe-11ea-9bb1-1c37cbe8badd.png)

> Tip: If you have just one, then it will be immediately Launched.

*Comands:*
* Create Android Emulator
* List of Android Emulators 
* Delete An Android Emulator

## Requirements

* Android studio installed with environment variables configured. 
* (Optional) Have at least one Emulator Created in AVD Manager. [Instructions here.](https://developer.android.com/studio/run/managing-avds) Or you can create one from this extension.

## Extension Settings

This will be added in a future release on `contributes.configuration` extension point.

Saving your last emulator selected from the list

* `androidlauncher.enable`: enable/disable this extension
* `androidlauncher.saveLastChoice`: enabling this will not ask for you to choose an emulator from the list next time

## Release Notes

- Added useful information messages, log erros and links to guide your when something goes wrong.
- Added Command: Create Android Emulator
- Added Command: List of Android Emulators 
- Added Command: Delete An Android Emulator

### 0.0.1

Initial release of Android Launching Emulator

### 0.0.3

New features release are still in experimental stage
-----------------------------------------------------------------------------------------------------------
