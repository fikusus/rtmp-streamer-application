import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  PermissionsAndroid,
  Image,
} from 'react-native';
import { LivestreamView } from '@api.video/react-native-livestream';
import { useNoSleep } from 'react-native-no-sleep';
const requestPermissions = async () => {
  try {
    PermissionsAndroid.request;
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
    if (
      granted['android.permission.CAMERA'] ===
      PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
    if (
      granted['android.permission.RECORD_AUDIO'] ===
      PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('You can use the microphone');
    } else {
      console.log('Microphone permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

const App = () => {

  useNoSleep();
  const ref = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [currentCam, setCurrentCam] = useState('front');
  const [streamKey, onChangeStreamKey] = React.useState('');
  const [permission, onChangePermission] = React.useState(false);

  const onPress = () => {
    currentCam === 'front' ? setCurrentCam('back') : setCurrentCam('front');
  };

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
          }}
          liveStreamKey="b2ddcaaa-d42d-4128-aa42-570f4d374151"
        />
        <View style={{ position: 'absolute', bottom: 40 }}>
          <TouchableOpacity
            style={{
              borderRadius: 50,
              backgroundColor: streaming ? 'red' : 'white',
              width: 50,
              height: 50,
            }}
            onPress={() => {
              if (streaming) {
                ref.current?.stopStreaming();
                setStreaming(false);
              } else {
                ref.current?.startStreaming();
                setStreaming(true);
              }
            }}
          />
        </View>
        <View style={{ position: 'absolute', bottom: 40, right: 40}}>
          <TouchableOpacity  onPress={onPress}>
            <Image style={styles.button}  source={require('./reverse-icon-5.png')} />
          </TouchableOpacity>
        </View>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  button: {
    height: 50,
    width: 50
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
});

export default App;
