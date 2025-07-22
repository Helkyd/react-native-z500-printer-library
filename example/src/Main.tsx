import React, { useCallback, useEffect } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  DeviceEventEmitter,
} from 'react-native'
import * as Z500PrinterLibrary from '@Helkyd/react-native-z500-printer-library'
import { Button } from './components/Button'
import { useToast } from 'react-native-toast-notifications'
import {
  sampleImageBase64,
  sampleTextEn,
  sampleTextHelloWorld,
  sampleTextJa,
} from './SampleResource'
import { Buffer } from 'buffer'

type Props = Record<string, never>
type ComponentProps = {
  onPressPrepare: () => void
  onPressPrintSelfChecking: () => void
  onPressPrintText: () => void
  onPressPrintTextAwait: () => void
  onPressPrintTextAsync: () => void
  onPressSendRAWData: () => void
  onPressPrintTable: () => void
  onPressPrintChangingStyle: () => void
  onPressPrintImage: () => void
  onPressPrintBarcode: () => void
  onPressScan: () => void
  onPressTransaction: () => void
}

const Component: React.FC<ComponentProps> = ({
  onPressPrepare,
  onPressPrintSelfChecking,
  onPressPrintText,
  onPressPrintTextAwait,
  onPressPrintTextAsync,
  onPressSendRAWData,
  onPressPrintTable,
  onPressPrintChangingStyle,
  onPressPrintImage,
  onPressPrintBarcode,
  onPressScan,
  onPressTransaction,
}) => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            @Helkyd/react-native-z500-printer-library
          </Text>
          <Button text="[MUST] prepare" onPress={onPressPrepare} />
          <Button
            text="print Self-Checking"
            onPress={onPressPrintSelfChecking}
          />
          <Button text="print text" onPress={onPressPrintText} />
          <Button text="print text (await)" onPress={onPressPrintTextAwait} />
          <Button text="print text (async)" onPress={onPressPrintTextAsync} />
          <Button text="send raw data" onPress={onPressSendRAWData} />
          <Button text="print table" onPress={onPressPrintTable} />
          <Button
            text="Print changing styles"
            onPress={onPressPrintChangingStyle}
          />
          <Button
            text="print Barcode / QR code"
            onPress={onPressPrintBarcode}
          />
          <Button text="print image" onPress={onPressPrintImage} />
          <Button text="scan" onPress={onPressScan} />
          <Button
            text="print text with transaction"
            onPress={onPressTransaction}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const Container: React.FC<Props> = () => {
  const toast = useToast()

  const onPressPrepare = useCallback(async () => {
    try {
      const isPrepared: boolean = await Z500PrinterLibrary.prepare()
      console.log(`isPrepared is ${isPrepared}`)

      const {
        serialNumber,
        printerVersion,
        serviceVersion,
        printerModal,
        paperWidth,
        pixelWidth,
      } = await Z500PrinterLibrary.getPrinterInfo()
      console.log(`serialNumber is ${serialNumber}`)
      console.log(`printerVersion is ${printerVersion}`)
      console.log(`serviceVersion is ${serviceVersion}`)
      console.log(`printerModal is ${printerModal}`)
      console.log(`paperWidth is ${paperWidth}`)
      console.log(`pixelWidth is ${pixelWidth}`)

      const printedLength = await Z500PrinterLibrary.getPrintedLength()
      console.log(`printedLength is ${printedLength}`)

      const { value, description } = await Z500PrinterLibrary.getPrinterState()
      console.log(`getPrinterState is (${value}, ${description}).`)

      toast.show('Prepare is OK')
    } catch (error) {
      console.warn(error)
      toast.show(`Prepare is failed. ${error}`)
    }
  }, [toast])

  const onPressPrintSelfChecking = useCallback(async () => {
    try {
      await Z500PrinterLibrary.printText('Print Self-Checking')
      await Z500PrinterLibrary.lineWrap(1)

      await Z500PrinterLibrary.printSelfChecking()
      await Z500PrinterLibrary.lineWrap(1)
    } catch (error) {
      console.warn(error)
      toast.show(`onPressPrintSelfChecking is failed. ${error}`)
    }
  }, [toast])

  const onPressPrintText = useCallback(async () => {
    try {
      await Z500PrinterLibrary.printText('Print Text (await)')
      await Z500PrinterLibrary.lineWrap(1)

      await Z500PrinterLibrary.printText(sampleTextEn)
      await Z500PrinterLibrary.lineWrap(1)

      await Z500PrinterLibrary.printText(sampleTextJa)
      await Z500PrinterLibrary.lineWrap(1)

      await Z500PrinterLibrary.lineWrap(3)
    } catch (error) {
      console.warn(error)
      toast.show(`PrintText is failed. ${error}`)
    }
  }, [toast])

  const onPressPrintTextAwait = useCallback(async () => {
    try {
      await Z500PrinterLibrary.printText('Print Text (await)')
      await Z500PrinterLibrary.lineWrap(1)

      await Z500PrinterLibrary.printText('0 ' + sampleTextHelloWorld)
      await Z500PrinterLibrary.printText('1 ' + sampleTextHelloWorld)
      await Z500PrinterLibrary.printText('2 ' + sampleTextHelloWorld)
      await Z500PrinterLibrary.printText('3 ' + sampleTextHelloWorld)
      await Z500PrinterLibrary.printText('4 ' + sampleTextHelloWorld)
      await Z500PrinterLibrary.printText('5 ' + sampleTextHelloWorld)
      await Z500PrinterLibrary.printText('6 ' + sampleTextHelloWorld)
      await Z500PrinterLibrary.printText('7 ' + sampleTextHelloWorld)
      await Z500PrinterLibrary.printText('8 ' + sampleTextHelloWorld)
      await Z500PrinterLibrary.printText('9 ' + sampleTextHelloWorld)

      await Z500PrinterLibrary.lineWrap(3)
    } catch (error) {
      console.warn(error)
      toast.show(`PrintText is failed. ${error}`)
    }
  }, [toast])

  const onPressPrintTextAsync = useCallback(async () => {
    try {
      Z500PrinterLibrary.printText('Print Text (no await)')
      Z500PrinterLibrary.lineWrap(1)

      Z500PrinterLibrary.printText('0 ' + sampleTextHelloWorld)
      Z500PrinterLibrary.printText('1 ' + sampleTextHelloWorld)
      Z500PrinterLibrary.printText('2 ' + sampleTextHelloWorld)
      Z500PrinterLibrary.printText('3 ' + sampleTextHelloWorld)
      Z500PrinterLibrary.printText('4 ' + sampleTextHelloWorld)
      Z500PrinterLibrary.printText('5 ' + sampleTextHelloWorld)
      Z500PrinterLibrary.printText('6 ' + sampleTextHelloWorld)
      Z500PrinterLibrary.printText('7 ' + sampleTextHelloWorld)
      Z500PrinterLibrary.printText('8 ' + sampleTextHelloWorld)
      Z500PrinterLibrary.printText('9 ' + sampleTextHelloWorld)

      Z500PrinterLibrary.lineWrap(3)
    } catch (error) {
      console.warn(error)
      toast.show(`PrintText is failed. ${error}`)
    }
  }, [toast])

  const onPressSendRAWData = useCallback(async () => {
    try {
      const boldOn = new Uint8Array([0x1b, 0x45, 0x01])
      const boldOnBase64 = Buffer.from(boldOn).toString('base64')
      await Z500PrinterLibrary.sendRAWData(boldOnBase64)

      await Z500PrinterLibrary.printText('\'sendRAWData\' sets Bold to ON')
      await Z500PrinterLibrary.lineWrap(1)

      const boldOff = new Uint8Array([0x1b, 0x45, 0x00])
      const boldOffBase64 = Buffer.from(boldOff).toString('base64')
      await Z500PrinterLibrary.sendRAWData(boldOffBase64)

      await Z500PrinterLibrary.printText('\'sendRAWData\' sets Bold to OFF')
      await Z500PrinterLibrary.lineWrap(1)

      await Z500PrinterLibrary.lineWrap(3)
    } catch (error) {
      console.warn(error)
      toast.show(`onPressSendRAWData is failed. ${error}`)
    }
  }, [toast])

  const onPressPrintTable = useCallback(async () => {
    try {
      await Z500PrinterLibrary.printText('Print Table')
      await Z500PrinterLibrary.lineWrap(1)

      const {
        serialNumber,
        printerVersion,
        serviceVersion,
        printerModal,
        paperWidth,
        pixelWidth,
      } = await Z500PrinterLibrary.getPrinterInfo()

      const widths = [30, 25]
      await Z500PrinterLibrary.printColumnsString(['name', 'value'], widths, [
        'center',
        'center',
      ])
      await Z500PrinterLibrary.printColumnsString(
        ['serial number:', serialNumber],
        widths,
        ['left', 'left']
      )
      await Z500PrinterLibrary.printColumnsString(
        ['printer version:', printerVersion],
        widths,
        ['left', 'left']
      )
      await Z500PrinterLibrary.printColumnsString(
        ['service version:', serviceVersion],
        widths,
        ['left', 'left']
      )
      await Z500PrinterLibrary.printColumnsString(
        ['printer modal:', printerModal],
        widths,
        ['left', 'left']
      )
      await Z500PrinterLibrary.printColumnsString(
        ['paper width:', paperWidth],
        widths,
        ['left', 'left']
      )
      await Z500PrinterLibrary.printColumnsString(
        ['pixel width:', `${pixelWidth}`],
        widths,
        ['left', 'left']
      )

      Z500PrinterLibrary.lineWrap(1)
      await Z500PrinterLibrary.printHR('plus')

      await Z500PrinterLibrary.printColumnsString(
        ['', 'apple', 'mellon', 'banana'],
        [8, 8, 8, 8],
        ['left', 'center', 'center', 'center']
      )

      await Z500PrinterLibrary.printHR('double')

      await Z500PrinterLibrary.printColumnsString(
        ['color', 'red', 'green', 'yellow'],
        [8, 8, 8, 8],
        ['left', 'center', 'center', 'center']
      )

      await Z500PrinterLibrary.printHR('line')

      await Z500PrinterLibrary.printColumnsString(
        ['taste', 'good', 'good', 'good'],
        [8, 8, 8, 8],
        ['left', 'center', 'center', 'center']
      )

      await Z500PrinterLibrary.printHR('wave')

      await Z500PrinterLibrary.printColumnsString(
        ['shape', 'small', 'ball', 'crescent'],
        [8, 8, 6, 10],
        ['left', 'center', 'center', 'center']
      )

      await Z500PrinterLibrary.printHR('star')

      await Z500PrinterLibrary.lineWrap(3)
    } catch (error) {
      console.warn(error)
      toast.show(`PrintText is failed. ${error}`)
    }
  }, [toast])

  const onPressPrintChangingStyle = useCallback(async () => {
    try {
      await Z500PrinterLibrary.printText('Print changing styles')
      await Z500PrinterLibrary.lineWrap(1)

      await Z500PrinterLibrary.setAlignment('right')
      await Z500PrinterLibrary.printText('right')

      await Z500PrinterLibrary.setAlignment('center')
      await Z500PrinterLibrary.printText('center')

      await Z500PrinterLibrary.setAlignment('left')
      await Z500PrinterLibrary.printText('left')

      await Z500PrinterLibrary.setTextStyle('bold', true)
      await Z500PrinterLibrary.printText('bold')
      await Z500PrinterLibrary.setTextStyle('bold', false)

      await Z500PrinterLibrary.setTextStyle('italic', true)
      await Z500PrinterLibrary.printText('italic')
      await Z500PrinterLibrary.setTextStyle('italic', false)

      await Z500PrinterLibrary.setParagraphStyle('leftSpacing', 50)
      await Z500PrinterLibrary.printText('leftSpacing sets 50.')
      await Z500PrinterLibrary.setParagraphStyle('leftSpacing', 0)

      await Z500PrinterLibrary.setFontSize(16)
      await Z500PrinterLibrary.printText('font size is 16')

      await Z500PrinterLibrary.setFontSize(32)
      await Z500PrinterLibrary.printText('font size is 32')

      await Z500PrinterLibrary.setDefaultFontSize()
      await Z500PrinterLibrary.printText(
        `font size is default (${Z500PrinterLibrary.defaultFontSize})`
      )

      await Z500PrinterLibrary.resetPrinterStyle()
      await Z500PrinterLibrary.lineWrap(3)
    } catch (error) {
      console.warn(error)
      toast.show(`PrintText is failed. ${error}`)
    }
  }, [toast])

  const onPressPrintBarcode = useCallback(async () => {
    try {
      await Z500PrinterLibrary.printText('Print Barcode')
      await Z500PrinterLibrary.lineWrap(1)

      await Z500PrinterLibrary.printText('(1) Barcode')
      await Z500PrinterLibrary.lineWrap(1)

      await Z500PrinterLibrary.printBarcode(
        '1234567890',
        'CODE128',
        162,
        2,
        'textUnderBarcode'
      )
      await Z500PrinterLibrary.lineWrap(2)

      await Z500PrinterLibrary.printText('(2) QR code')
      await Z500PrinterLibrary.lineWrap(1)

      await Z500PrinterLibrary.printQRCode('Hello World', 8, 'middle')
      await Z500PrinterLibrary.lineWrap(4)
    } catch (error) {
      console.warn(error)
      toast.show(`onPressPrintImage is failed. ${error}`)
    }
  }, [toast])

  const onPressPrintImage = useCallback(async () => {
    try {
      await Z500PrinterLibrary.printText('Print Image')
      await Z500PrinterLibrary.lineWrap(1)

      await Z500PrinterLibrary.printText('(1) binary')
      await Z500PrinterLibrary.lineWrap(1)

      await Z500PrinterLibrary.printImage(sampleImageBase64, 384, 'binary')
      await Z500PrinterLibrary.lineWrap(2)

      await Z500PrinterLibrary.printText('(2) grayscale')
      await Z500PrinterLibrary.lineWrap(1)

      await Z500PrinterLibrary.printImage(sampleImageBase64, 384, 'grayscale')
      await Z500PrinterLibrary.lineWrap(4)
    } catch (error) {
      console.warn(error)
      toast.show(`onPressPrintImage is failed. ${error}`)
    }
  }, [toast])

  const onPressScan = useCallback(async () => {
    try {
      const result = await Z500PrinterLibrary.scan()
      console.warn(`onPressScan is ${result}`)
    } catch (error) {
      console.warn(error)
      toast.show(`onPressScan is failed. ${error}`)
    }
  }, [toast])

  useEffect(() => {
    DeviceEventEmitter.addListener(
      Z500PrinterLibrary.EventType.onScanSuccess,
      (message) => {
        console.log(`[onScanSuccess] ${message}`)
      }
    )
    DeviceEventEmitter.addListener(
      Z500PrinterLibrary.EventType.onScanFailed,
      (message) => {
        console.log(`[onScanFailed] ${message}`)
      }
    )
    return () => {
      DeviceEventEmitter.removeAllListeners(
        Z500PrinterLibrary.EventType.onScanSuccess
      )
      DeviceEventEmitter.removeAllListeners(
        Z500PrinterLibrary.EventType.onScanFailed
      )
    }
  }, [])

  const onPressTransaction = useCallback(async () => {
    try {
      const hr = await Z500PrinterLibrary.hr('line')

      await Z500PrinterLibrary.enterPrinterBuffer(true)

      Z500PrinterLibrary.printText('Transaction Test 0')
      Z500PrinterLibrary.printText(hr)

      await Z500PrinterLibrary.commitPrinterBuffer()

      Z500PrinterLibrary.printText('Transaction Test 1')
      Z500PrinterLibrary.printText('Transaction Test 2')
      Z500PrinterLibrary.printText('Transaction Test 3')
      Z500PrinterLibrary.lineWrap(4)

      await Z500PrinterLibrary.exitPrinterBuffer(true)
    } catch (error) {
      console.warn(error)
    }
  }, [])

  return (
    <Component
      {...{
        onPressPrepare,
        onPressPrintSelfChecking,
        onPressPrintText,
        onPressPrintTextAwait,
        onPressPrintTextAsync,
        onPressSendRAWData,
        onPressPrintTable,
        onPressPrintChangingStyle,
        onPressPrintBarcode,
        onPressPrintImage,
        onPressScan,
        onPressTransaction,
      }}
    />
  )
}

export { Container as Main }

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: '#ffffff',
  },
  scrollView: {
    backgroundColor: '#ffffff',
  },
  sectionContainer: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
})
