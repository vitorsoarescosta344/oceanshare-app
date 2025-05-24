import React, {useEffect, useState} from 'react';
import {ONESIGNAL_ID, isDev, isHom} from '../utils/common';
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
import {Button, useTheme} from '@rneui/themed';
import {login} from '../services/auth.service';
import useLogIn from '../hooks/useLogin';
import {OneSignal} from 'react-native-onesignal';
import api from '../services/api';

const schema = object({
  //@ts-ignore
  cpf: string().required('Preencha os campos'),
  password: string().required('Preencha os campos'),
});

export default function Login({navigation}: {navigation: any}) {
  const [cpf, setCpf] = useState<string>(isDev() ? '04736046988' : '');
  const [password, setPassword] = useState<string>(isDev() ? '123456' : '');
  const [userId, setUserId] = useState<string>('');

  const logIn = useLogIn();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function Login(data: any) {
    let cpfClear = data.cpf.replace(/[.]/g, '').replace('-', '');

    //const res = login(cpfClear, password, userId)

    try {
      const onesignal_id = await OneSignal.User.pushSubscription.getIdAsync();

      const userData = await login(cpfClear, data.password, onesignal_id);
      if (userData.AlterPassword) {
        navigation.navigate('AlterPassword', {
          user_id: userData.Id,
          hide: true,
          cpf: cpfClear,
          onesignal_id,
        });
      } else {
        logIn(userData);
      }
    } catch (error: any) {
      Alert.alert(
        'Erro',
        'Usuário ou senha inválidos. Por favor, verifique suas credenciais e tente novamente.',
      );
    }
  }

  const {theme} = useTheme();

  return (
    <View style={{flex: 1, backgroundColor: '#faf9f9'}}>
      <ImageBackground
        style={{flex: 1}}
        source={require('../assets/login_background_ocean.jpeg')}>
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
              source={require('../assets/Ocean-Share-branco.png')}
              style={{width: '100%', height: 250, resizeMode: 'cover'}}
            />
            <View>
              {(isDev() || isHom()) && (
                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: 10,
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: '#D2745A',
                      fontSize: 20,
                    }}>
                    {isDev() ? 'Desenvolvimento' : 'Demonstração'}
                  </Text>
                </View>
              )}
              <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <MaskInputLogin
                    placeholder="Digite seu CPF"
                    mask={Masks.BRL_CPF}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="numeric"
                    textContentType="none"
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
              <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <InputPasswordLogin
                    onChangeText={onChange}
                    value={value}
                    placeholder="Senha"
                    placeholderTextColor={theme.colors.primary}
                    style={{color: theme.colors.secondary, fontSize: 18}}
                    secureTextEntry
                    containerStyle={{marginBottom: 10}}
                    textContentType="none"
                  />
                )}
                name="password"
              />
              {errors?.password && (
                <View>
                  <Text
                    style={{
                      color: '#D2745A',
                      fontSize: 12,
                    }}>{`${errors.password.message}`}</Text>
                </View>
              )}
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                style={{alignSelf: 'center'}}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: '#8ccccc',
                  }}>
                  Esqueci minha senha.
                </Text>
              </TouchableOpacity>

              <Button
                buttonStyle={{height: 50}}
                onPress={handleSubmit(Login)}
                title={'Entrar'}
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </View>
  );
}
