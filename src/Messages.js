const UNABLE_TO_GET_PACKAGE = 'Unable to get the list of packaged on your system. Did you configured your android environment variables?'
const UNABLE_TO_CREATE_EMULATOR = `Unable to create the emulator`
const UNABLE_TO_DOWNLOAD_PACKAGE = `Unable to download the Android Package. Did you configured your android environment variables?`
const ENVIRONMENT_NOT_CONFIGURED = `You haven't configured your environment variables ANDROID_HOME or ANDROID_SDK_HOME correctly in your system.`
+` Please refer this to: https://stackoverflow.com/questions/23042638/how-do-i-set-android-sdk-home-environment-variable`
const EMULATOR_NOT_DELETED = `Ops! The emulator selected could not be deleted.`


module.exports = {
    UNABLE_TO_GET_PACKAGE,
    UNABLE_TO_CREATE_EMULATOR,
    UNABLE_TO_DOWNLOAD_PACKAGE,
    ENVIRONMENT_NOT_CONFIGURED,
    EMULATOR_NOT_DELETED
};