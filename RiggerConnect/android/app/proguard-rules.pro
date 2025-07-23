# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.kts.

# Keep your application class
-keep class com.riggerconnect.RiggerApp { *; }

# Retrofit rules
-keepattributes Signature
-keepattributes *Annotation*
-keep class retrofit2.** { *; }
-keepclasseswithmembers class * {
    @retrofit2.http.* <methods>;
}

# Gson rules
-keepattributes Signature
-keepattributes *Annotation*
-keep class com.riggerconnect.model.** { *; }

# General Android rules
-keepclassmembers class * implements android.os.Parcelable {
    public static final ** CREATOR;
}
