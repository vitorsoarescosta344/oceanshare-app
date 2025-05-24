import {Button, Icon, useTheme} from '@rneui/themed';
import {useCallback, useContext, useState} from 'react';
import {Modal, Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useDispatch, useSelector} from 'react-redux';
import {selectUser, setUser} from '../redux/slices/authSlice';
import axios from 'axios';
import {server, showError} from '../utils/common';
import {useSignOut} from '../hooks/useSignOut';
import {NavigationContext} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

interface IConfirmModalProps {
  isVisible: boolean;
  onCloseRequest: () => void;
}

export default function ProfileModal({
  isVisible,
  onCloseRequest,
}: IConfirmModalProps) {
  const {theme} = useTheme();

  const [changePhoto, setChangePhoto] = useState(false);

  const user = useSelector(selectUser);

  const navigation = useContext(NavigationContext);

  const signOut = useSignOut();

  const dispatch = useDispatch();

  const onCameraPress = useCallback(async () => {
    const data = await launchCamera({includeBase64: true, mediaType: 'photo'});

    if (data.didCancel) {
      return;
    }

    try {
      let profile = user;

      const accessToken = await AsyncStorage.getItem('accessToken');

      //@ts-ignore
      profile.Photo = 'data:image/png;base64,' + data.assets[0].base64;

      await axios.put(
        `${server}/User/SavePhoto/${user?.Id}`,
        //@ts-ignore
        {...profile, Photo: 'data:image/png;base64,' + data.assets[0].base64},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      dispatch(
        setUser({
          ...user,
          //@ts-ignore
          Photo: 'data:image/png;base64,' + data.assets[0].base64,
        }),
      );
      onCloseRequest();
    } catch (error: any) {
      if (error.response.status == 401) signOut();
      else showError('Não foi possível salvar a foto');
    } finally {
      //await this.setState({isLoading: false, photo: null});
      //await this.setState({optionsVisible: false, preview: false});
    }
  }, []);

  const onGaleryPress = useCallback(async () => {
    const data = await launchImageLibrary({
      includeBase64: true,
      mediaType: 'photo',
      selectionLimit: 1,
    });

    if (data.didCancel) {
      return;
    }

    try {
      let profile = user;

      const accessToken = await AsyncStorage.getItem('accessToken');

      //@ts-ignore
      profile.Photo = 'data:image/png;base64,' + data.assets[0].base64;

      await axios.put(
        `${server}/User/SavePhoto/${user?.Id}`,
        //@ts-ignore
        {...profile, Photo: 'data:image/png;base64,' + data.assets[0].base64},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      dispatch(
        setUser({
          ...user,
          //@ts-ignore
          Photo: 'data:image/png;base64,' + data.assets[0].base64,
        }),
      );
      onCloseRequest();
    } catch (error: any) {
      if (error.response.status == 401) signOut();
      else showError('Não foi possível salvar a foto');
    } finally {
      //await this.setState({isLoading: false, photo: null});
      //await this.setState({optionsVisible: false, preview: false});
    }
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {}}>
      <TouchableOpacity
        onPress={() => {
          setChangePhoto(false);
          onCloseRequest();
        }}
        style={styles.confirmModal}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 5,
            marginHorizontal: 15,
            marginBottom: 20,
            padding: 15,
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => {
                setChangePhoto(false);
              }}>
              <Icon
                name="chevron-left"
                size={30}
                color={changePhoto ? theme.colors.primary : '#fff'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setChangePhoto(false);
                onCloseRequest();
              }}>
              <Icon name="close" size={30} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          {changePhoto ? (
            <>
              <Button
                onPress={() => onCameraPress()}
                containerStyle={{
                  width: '100%',
                }}
                title={'Tirar Foto'}
              />
              <Button
                onPress={() => onGaleryPress()}
                containerStyle={{
                  width: '100%',
                }}
                title={'Galeria'}
              />
            </>
          ) : (
            <>
              <Button
                onPress={() => setChangePhoto(true)}
                containerStyle={{
                  width: '100%',
                }}
                title={'Alterar Foto'}
              />
              <Button
                onPress={() => {
                  onCloseRequest();
                  navigation?.navigate('AlterPassword', {
                    user_id: user.Id,
                    hide: false,
                  });
                }}
                containerStyle={{
                  width: '100%',
                }}
                title={'Alterar Senha'}
              />
              <Button
                onPress={() => signOut()}
                containerStyle={{
                  width: '100%',
                }}
                buttonStyle={{backgroundColor: '#D2745A'}}
                title={'Sair do App'}
              />
            </>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  confirmModal: {
    backgroundColor: 'rgba(0, 0, 0, 0.5);',
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});
