import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, Image, Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import * as ImagePicker from 'expo-image-picker';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

import defaultImg from '../assets/default.png';
import { Entypo } from '@expo/vector-icons';

type IUser = {
  name: string;
  image: string;
};

export function Header() {
  const [user, setUser] = useState<IUser>({} as IUser);

  useEffect(() => {
    async function loadStorageUsername() {
      const data = await AsyncStorage.getItem('@plantmanager:user');
      const user = data ? (JSON.parse(data) as IUser) : ({} as IUser);
      setUser(user);
    }
    loadStorageUsername();
  }, []);

  async function permissionRequest() {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Desculpa, precisamos de permissão para acessar a galeria. 😥');
      }
    }
  }

  async function pickImage() {
    try {
      await permissionRequest();
    } catch {
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled && result.type == 'image') {
      setUser({ ...user, image: result.uri });
      await AsyncStorage.setItem(
        '@plantmanager:user',
        JSON.stringify({ ...user, image: result.uri })
      );
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Olá,</Text>
        <Text style={styles.username}>{user.name}</Text>
      </View>

      <View>
        <View style={styles.cameraContainer}>
          <TouchableOpacity onPress={pickImage} activeOpacity={0.5}>
            <Entypo name="camera" color={colors.green_dark} size={24} />
          </TouchableOpacity>
        </View>
        <Image
          style={styles.image}
          source={user.image === 'default.png' ? defaultImg : { uri: user.image }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: getStatusBarHeight(),
  },
  greeting: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.text,
  },
  username: {
    fontSize: 32,
    fontFamily: fonts.heading,
    color: colors.heading,
    lineHeight: 40,
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.green,
  },
  cameraContainer: {
    position: 'absolute',
    zIndex: 99999,
    bottom: 0,
    right: 0,
    backgroundColor: colors.green_light,
    height: 35,
    width: 35,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
