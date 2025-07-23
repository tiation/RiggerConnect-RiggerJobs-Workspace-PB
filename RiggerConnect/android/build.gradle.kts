buildscript {
    val kotlinVersion = "1.8.20"
    val composeVersion = "1.4.3"
    
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle:8.0.0")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion")
        classpath("com.google.dagger:hilt-android-gradle-plugin:2.46")
    }
}

tasks.register("clean", Delete::class) {
    delete(rootProject.buildDir)
}
