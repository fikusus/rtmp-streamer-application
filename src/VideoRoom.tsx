import React, { useRef, useState, useEffect } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Image,
  ToastAndroid,
  Platform,
} from 'react-native'
import { LivestreamView } from '@api.video/react-native-livestream'
import { useKeepAwake } from 'expo-keep-awake'
import Icon from 'react-native-vector-icons/FontAwesome5';


const requestPermissions = async () => {
  try {
    PermissionsAndroid.request
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ])
    if (
      granted['android.permission.CAMERA'] ===
      PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('You can use the camera')
    } else {
      console.log('Camera permission denied')
    }
    if (
      granted['android.permission.RECORD_AUDIO'] ===
      PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('You can use the microphone')
    } else {
      console.log('Microphone permission denied')
    }
  } catch (err) {
    console.warn(err)
  }
}

const notify = (message: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT)
  }
}

const VideoRoom = () => {
  useKeepAwake()
  const ref = useRef(null)
  const [streaming, setStreaming] = useState(false)
  const [currentCam, setCurrentCam] = useState('front')
  const [permission, onChangePermission] = React.useState(false)

  const onPress = () => {
    currentCam === 'front' ? setCurrentCam('back') : setCurrentCam('front')
  }
  useEffect(() => {
    (async function anyNameFunction() {
      await requestPermissions();
      onChangePermission(true);
    })();
  }, []);
  if (!permission) {
    return <View></View>;
  } else
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <LivestreamView
          style={{ flex: 1, backgroundColor: 'black', alignSelf: 'stretch' }}
          ref={ref}
          video={{
            fps: 30,
            resolution: '1080p',
            camera: currentCam,
            orientation: 'portrait',
            bitrate: 3000000
          }}
          audio={{
              bitrate: 384000
            }}
          liveStreamKey="b2ddcaaa-d42d-4128-aa42-570f4d374151"
          onConnectionSuccess={() => {
            notify("Stream started successfully");
            console.log('Received onConnectionSuccess')
          }}
          onConnectionFailed={(e) => {
            notify("Failed to connect to server");
            console.log('Received onConnectionFailed', e)
            ref.current?.stopStreaming()
            setStreaming(false)
          }}
          onDisconnect={() => {
            notify("Disconnected");
            console.log('Received onDisconnect')
            ref.current?.stopStreaming()
            setStreaming(false)
          }}
        />
        <View style={{ position: 'absolute', bottom: 40 }}>
          <TouchableOpacity
            style={{
              width: 60,
              height: 60,
            }}
            onPress={() => {
              if (streaming) {
                ref.current?.stopStreaming()
                setStreaming(false)
              } else {
                ref.current?.startStreaming()
                setStreaming(true)
              }
            }}
          >
          <Icon
            name="circle"
            
            size={59}
            style={{color:streaming ? 'red' : 'white',}}
            solid 
          >
          </Icon>

          </TouchableOpacity>
        </View>
        <View style={{ position: 'absolute', bottom: 40, right: 40 }}>
          <TouchableOpacity onPress={onPress}>
          <Icon
            name="sync-alt"
            size={50}
            style={{color:"white"}}
          >
          </Icon>
          </TouchableOpacity>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  button: {
    height: 50,
    width: 50,
  },
  countContainer: {
    alignItems: 'center',
    padding: 10,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
})

export default VideoRoom
