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
import android.content.IntentFilter;

import com.ctk.sdk.ByteUtil;

import android.content.BroadcastReceiver;

/**
 * @see
 * https://developer.sunmi.com/docs/en-US/xeghjk491/ciceghjk502
 */
class Z500ScannerLibraryModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private val context = getReactApplicationContext()
  private val REQUEST_CODE = 1669 //5839
  private val onScanSuccess = "onScanSuccess"
  private val onScanFailed = "onScanFailed"
  private var mPromise: Promise? = null

  //Z500
  public val ENCODE_MODE_UTF8: Int = 1
  public val ENCODE_MODE_GBK: Int = 2
  public val ENCODE_MODE_NONE = 3

  private var strbuild: StringBuilder = StringBuilder()
  private var mScanReceiver: BroadcastReceiver? = null

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
          val scanResult = ""
          val length: Int = data.getIntExtra("EXTRA_SCAN_LENGTH", 0)
          val encodeType: Int = data.getIntExtra("EXTRA_SCAN_ENCODE_MODE", 1)
          Log.d("Z500-Scanner","ENCODETYPE: $encodeType")

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
    Log.d("Z500-Scanner", "Start init...")
    context.addActivityEventListener(activityEventListener)

    // Initialize the BroadcastReceiver
    mScanReceiver = object : BroadcastReceiver() {
      override fun onReceive(context: Context, intent: Intent) {
        var scanResult = ""
        var length = intent.getIntExtra("EXTRA_SCAN_LENGTH", 0)
        val encodeType = intent.getIntExtra("EXTRA_SCAN_ENCODE_MODE", 1)
        Log.e("Z500-Scanner","OnScanReCIEVER.....")
        scanResult = if (encodeType == ENCODE_MODE_NONE) {
          val bresult = intent.getByteArrayExtra("EXTRA_SCAN_RAW_DATA")
          length = intent.getIntExtra("EXTRA_SCAN_RAW_DATA_LEN", 0)
          ByteUtil.bytearrayToHexString(bresult, length)
        } else {
          intent.getStringExtra("EXTRA_SCAN_DATA") ?: ""
        }
        Log.e("Z500-Scanner","SCANRESUL: ${scanResult}")
        /*
        if (strbuild.length > 120) {
          strbuild.setLength(0)
        }
        strbuild.append(scanResult)
        strbuild.append("\n")
        *
         */
        //Log.e("Scan", "scan receive strbuild.toString()=${strbuild.toString()}")
        //Log.e("Z500-Scanner", "scan receive strbuild.toString()=$scanResult")
        mPromise?.resolve(scanResult)
        //tvMsg?.text = strbuild.toString()
      }
    }

    // Register the receiver
    val filter = IntentFilter("ACTION_BAR_SCAN")
    context.registerReceiver(mScanReceiver, filter)
  }

  override fun getName(): String {
    return NAME
  }

  companion object {
    const val NAME = "Z500ScannerLibrary"
    //Z500
    const val ENCODE_MODE_UTF8: Int = 1
    const val ENCODE_MODE_GBK: Int = 2
    const val ENCODE_MODE_NONE = 3

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
    val activity: Activity? = currentActivity
    Log.e("Z500-Scanner", "activity: $activity")

    if (activity == null) {
      sendEventFailed("scan is failed. There is not an activity.")
      return
    }

    try {
      mPromise = promise

      // 1. First send the configuration broadcast
      val configIntent = Intent("ACTION_BAR_SCANCFG").apply {
        putExtra("EXTRA_SCAN_POWER", 1)
        putExtra("EXTRA_SCAN_AUTOENT", 0)
        putExtra("EXTRA_SCAN_MODE", 3)
      }
      activity.sendBroadcast(configIntent)

      // 2. Then start the scan
      val startIntent = Intent("ACTION_BAR_TRIGSCAN").apply {
        putExtra("EXTRA_SCAN_MODE", 3) // set api result mode
        putExtra("timeout", 60) // Units per second, maximum 9
      }
      Log.e("Z500-Scanner", "Start Scan...")
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
    Log.d("Z500-Scanner","Call sendEventSuccess")
    val emitter = context.getJSModule(RCTDeviceEventEmitter::class.java)
    emitter.emit(onScanSuccess, message)
    mPromise?.resolve(message)
    mPromise = null
  }

  private fun sendEventFailed(message: String) {
    Log.d("Z500-Scanner","Call sendEventFailed")
    val emitter = context.getJSModule(RCTDeviceEventEmitter::class.java)
    emitter.emit(onScanFailed, message)
    mPromise?.reject("0", "scan is failed. " + message)
    mPromise = null
  }

}
