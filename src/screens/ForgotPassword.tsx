import React, {useState} from 'react';
import {isDev, isHom} from '../utils/common';
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native';
import MaskInputLogin from '../components/MaskInputLogin';
import InputPasswordLogin from '../components/InputPasswordLogin';
import {Masks} from 'react-native-mask-input';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {string, object} from 'yup';
import {Button} from '@rneui/themed';
import api from '../services/api';

const schema = object({
  //@ts-ignore
  cpf: string().required('Preencha os campos'),
});

export default function ForgotPassword({navigation}: {navigation: any}) {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      let cpfClear = data.cpf.replace(/[.]/g, '').replace('-', '');

      await api.post(`/Login/ForgotPassword/${cpfClear}`);
      Alert.alert('Sua nova senha foi enviada por email', '', [
        {
          text: 'Ok',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ImageBackground
        style={{flex: 1}}
        source={require('../assets/forgot-background-ocean.jpeg')}>
        <View
          style={{
            flex: 1,
            padding: 20,
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}>
          <KeyboardAvoidingView
            style={{flex: 1, justifyContent: 'space-between'}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Image
              source={require('../assets/Ocean-transparente.png')}
              style={{width: '100%', height: 250, resizeMode: 'cover'}}
            />
            {(isDev() || isHom()) && (
              <View
                style={{
                  flexDirection: 'row',
                  marginVertical: 10,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{fontWeight: 'bold', color: '#D2745A', fontSize: 20}}>
                  {isDev() ? 'Desenvolvimento' : 'Demonstração'}
                </Text>
              </View>
            )}
            <View>
              <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <MaskInputLogin
                    placeholder="Digite seu CPF"
                    mask={Masks.BRL_CPF}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="cpf"
              />
              {errors?.cpf && (
                <View>
                  <Text
                    style={{
                      color: '#D2745A',
                      fontSize: 12,
                    }}>{`${errors.cpf.message}`}</Text>
                </View>
              )}

              <Button
                title={'Recuperar senha'}
                onPress={handleSubmit(onSubmit)}
              />
              <Button
                onPress={() => navigation.goBack()}
                buttonStyle={{backgroundColor: '#D2745A'}}
                title={'Cancelar'}
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </View>
  );
}
