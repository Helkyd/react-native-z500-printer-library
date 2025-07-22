package com.z500printerlibrary

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.os.Bundle
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter

//Z500
import android.content.ComponentName;
import android.util.Log;

/**
 * @see
 * https://developer.sunmi.com/docs/en-US/xeghjk491/ciceghjk502
 */
class Z500ScannerLibraryModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private val context = getReactApplicationContext()
  private val REQUEST_CODE = 5839
  private val onScanSuccess = "onScanSuccess"
  private val onScanFailed = "onScanFailed"
  private var mPromise: Promise? = null

  //Z500
  val ENCODE_MODE_UTF8: Int = 1
  val ENCODE_MODE_GBK: Int = 2
  val ENCODE_MODE_NONE: Int = 3


  private val activityEventListener = object : BaseActivityEventListener() {
    override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
      try{
        Log.d("Z500-Scanner","requestCode: $requestCode")
        Log.d("Z500-Scanner","DATA: $data")
        if (requestCode == REQUEST_CODE && data != null) {
          val bundle: Bundle? = data.getExtras()
          val result = bundle?.getSerializable("data") as ArrayList<HashMap<String, String>>
          val it = result.iterator()
          while (it.hasNext()) {
            val hashMap = it.next();
            sendEventSuccess(hashMap["VALUE"].toString())
          }
        } else if (data != null) {
          val bundle: Bundle? = data.getExtras()
          val result = bundle?.getSerializable("data") as ArrayList<HashMap<String, String>>
          Log.d("Z500-Scanner","REsultdoa: $result")
          val it = result.iterator()
          while (it.hasNext()) {
            val hashMap = it.next();
            val result_hashmap = hashMap["VALUE"].toString()
            Log.d("Z500-Scanner","hasMap: $result_hashmap")
            sendEventSuccess(hashMap["VALUE"].toString())
          }
        }else{
          sendEventFailed("scan() is failed.")
        }
      } catch (e: Exception) {
        sendEventFailed("scan() is failed. " + e.message)
      }
    }
  }

  init {
    context.addActivityEventListener(activityEventListener);
  }

  override fun getName(): String {
    return NAME
  }

  companion object {
    const val NAME = "Z500ScannerLibrary"
  }

  //Z500
/*
  private fun sendBroadCast(debugMode: Int) {
    //发送广播:是否显示水印
    //Whether to display the watermark
    val intent1: Intent = Intent("security.action.set_mode_success")
    intent1.setComponent(
      ComponentName(
        "com.android.systemui",
        "com.android.systemui.SecurityModeReceiver"
      )
    )
    //mode 0:交易  1:调试
    //mode 2:transaction   1:debug
    intent1.putExtra("mode", debugMode)
    sendBroadcast(intent1)
    //发送广播:调试是否打开
    //Debugging enabled or not
    val intent2: Intent = Intent("security.action.set_mode_success")
    intent2.setComponent(
      ComponentName(
        "com.android.settings",
        "com.android.settings.SecurityModeReceiver"
      )
    )
    intent2.putExtra("mode", debugMode)
    sendBroadcast(intent2)
  }
*/
  @ReactMethod
  fun z500Scan(promise: Promise) {
    val activity: Activity? = getCurrentActivity()
    Log.e("Z500-Scanner","activity: $activity")
    if (activity == null) {
      sendEventFailed("scan is failed. There is not an activity.")
      return
    }
    try {
      mPromise = promise
      val intent = Intent("ACTION_BAR_SCANCFG")
      //intent.setPackage("com.sunmi.sunmiqrcodescanner")
      Log.e("Z500-Scanner","Extra Scan Power")
      intent.putExtra("EXTRA_SCAN_POWER", 1);
      //Log.e("Z500-Scanner","Put Extra Play Sound")
      //intent.putExtra("PLAY_SOUND", true)
      //activity.startActivityForResult(intent, REQUEST_CODE)
      activity.sendBroadcast(intent)

      //Start scanning
      val startIntent = Intent("ACTION_BAR_TRIGSCAN")
      startIntent.putExtra("timeout", 60) // Units per second,and Maximum 9
      Log.e("Z500-Scanner","Start Scan...")

      activity.sendBroadcast(startIntent)


    } catch (e: Exception) {
      sendEventFailed("scan is failed. " + e.message)
    }

  }

  @ReactMethod
  fun scan(promise: Promise) {
    val activity: Activity? = getCurrentActivity()
    if (activity == null) {
      sendEventFailed("scan is failed. There is not an activity.")
      return
    }
    try {
      mPromise = promise
      val intent = Intent("com.sunmi.scan")
      intent.setPackage("com.sunmi.sunmiqrcodescanner")
      intent.putExtra("PLAY_SOUND", true)
      activity.startActivityForResult(intent, REQUEST_CODE)
    } catch (e: Exception) {
      sendEventFailed("scan is failed. " + e.message)
    }
  }

  private fun sendEventSuccess(message: String) {
    val emitter = context.getJSModule(RCTDeviceEventEmitter::class.java)
    emitter.emit(onScanSuccess, message)
    mPromise?.resolve(message)
    mPromise = null
  }

  private fun sendEventFailed(message: String) {
    val emitter = context.getJSModule(RCTDeviceEventEmitter::class.java)
    emitter.emit(onScanFailed, message)
    mPromise?.reject("0", "scan is failed. " + message)
    mPromise = null
  }

}
