package com.hidreamers.meditatelearnanddream
import expo.modules.splashscreen.SplashScreenManager

import android.os.Bundle
import com.facebook.react.ReactActivity

class MainActivity : ReactActivity() {
    override fun getMainComponentName(): String? {
        return "meditatelearn"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
    // @generated begin expo-splashscreen - expo prebuild (DO NOT MODIFY) sync-f3ff59a738c56c9a6119210cb55f0b613eb8b6af
    SplashScreenManager.registerOnActivity(this)
    // @generated end expo-splashscreen
        super.onCreate(null)
    }
}
