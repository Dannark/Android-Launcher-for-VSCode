# Android Emulator Launcher 

An Extension for VSCode to help you in your Android Development. This allow you to start and Emulator more easily.

## Instructions

To Launch your prefered emulator, press `Ctrl + Shift + P` and search for the command `Run Android Emulator` then press `Enter`. The list of avaliable emulator will show up on the screen, just select the one you want.

![Extension](https://user-images.githubusercontent.com/7622553/83576529-5dc90d00-a508-11ea-8aa7-5c6befcd0966.gif)

> Tip: If you have just one, then it will be immediately Launched.

*Comands:*
* `Run Android Emulator`
* `Create Android Emulator`
* `Delete An Android Emulator`
* `Enable Dedicated Android Emulator`
* `Disable Dedicated Android Emulator`

*Dedicated windows*

It follows the visual code window focus and snap right to it
![follow_windows2](https://user-images.githubusercontent.com/7622553/83795925-925ad700-a676-11ea-8f14-1839c13c2619.gif)

## Requirements

* Android studio installed with environment variables configured. 
* (Optional) Have at least one Emulator Created in AVD Manager. [Instructions here.](https://developer.android.com/studio/run/managing-avds) Or you can create one from this extension.
* Make sure your system Virtualization (VT-x/AMD-V) is enabled in the bios [Instructions here.](https://github.com/Dannark/Android-Launcher-for-VSCode/issues/1#issuecomment-639128560)

## Extension Settings

This will be added in a future release on `contributes.configuration` extension point.

Saving your last emulator selected from the list

* `androidlauncher.enable`: enable/disable this extension
* `androidlauncher.saveLastChoice`: enabling this will not ask for you to choose an emulator from the list next time

## Release Notes

### 0.0.6
See the changes log [here](https://marketplace.visualstudio.com/items/Dannark.AndroidLauncher/changelog).
