import {Controller, useForm} from 'react-hook-form';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Image,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Platform,
} from 'react-native';
import MaskInputLogin from '../components/MaskInputLogin';
import InputPasswordLogin from '../components/InputPasswordLogin';
import {Button, Icon, useTheme} from '@rneui/themed';
import {isDev, isHom, server} from '../utils/common';
import {yupResolver} from '@hookform/resolvers/yup';
import {object, ref, string} from 'yup';
import axios from 'axios';
import Loading from '../components/Loading';
import {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useLogIn from '../hooks/useLogin';
import {login} from '../services/auth.service';

const schema = object({
  //@ts-ignore
  oldPassword: string().required('Preencha os campos'),
  newPassword: string()
    .required('Preencha os campos')
    .min(6, 'Nova senha deve ter ao menos 6 caracteres.'),

  confirmNewPassword: string().oneOf(
    //@ts-ignore
    [ref('newPassword'), null],
    'Senha e confirmação não correspondentes.',
  ),
});

export default function AlterPassword({navigation, route}: any) {
  const {theme} = useTheme();

  const {user_id, hide, cpf, onesignal_id} = route.params;

  const logIn = useLogIn();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  console.log(route.params);

  const save = async (data: any) => {
    try {
      setLoading(true);
      const accessToken = await AsyncStorage.getItem('accessToken');

      await axios.post(
        `${server}/Login/AlterPassword`,
        {
          UserId: user_id,
          OldPassword: data.oldPassword,
          NewPassword: data.newPassword,
          ConfirmPassword: data.confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (hide) {
        const userData = await login(cpf, data.newPassword, onesignal_id);
        logIn(userData);
        navigation.navigate('Home');
      } else {
        navigation.navigate('Home');
      }
    } catch (error: any) {
      if (error?.response && error?.response?.data?.Errors?.length != 0) {
        let errorMsg = '';
        error?.response?.data?.Errors?.forEach((msg: any) => {
          errorMsg += msg.Message;
        });
        Alert.alert('', errorMsg);
      } else {
        Alert.alert('', error.message);
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ImageBackground
        style={{flex: 1}}
        source={require('../assets/loginbackground.jpeg')}>
        <SafeAreaView style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.7)'}}>
          <View
            style={{
              flex: 1,
              padding: 20,
            }}>
            <View style={{flexDirection: 'row', gap: 20, alignItems: 'center'}}>
              <TouchableOpacity
                style={{
                  display: !hide ? 'flex' : 'none',
                  height: 40,
                  width: 40,
                  backgroundColor: '#fff',
                  borderRadius: 5,

                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => navigation.goBack()}>
                <Icon
                  name="chevron-left"
                  size={30}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 22,
                  color: '#fff',
                }}>
                Alterar Senha
              </Text>
            </View>
            <KeyboardAvoidingView
              style={{flex: 1, justifyContent: 'flex-end'}}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <InputPasswordLogin
                    onChangeText={onChange}
                    value={value}
                    placeholder="Senha"
                    placeholderTextColor={'#8e681a'}
                    style={{color: '#8e681a', fontSize: 18}}
                    secureTextEntry
                    containerStyle={{marginBottom: 10}}
                  />
                )}
                name="oldPassword"
              />
              {
                //@ts-ignore
                errors?.oldPassword && (
                  <View>
                    <Text
                      style={{
                        color: '#D2745A',
                        fontSize: 12,
                      }}>{`${errors.oldPassword.message}`}</Text>
                  </View>
                )
              }
              <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <InputPasswordLogin
                    onChangeText={onChange}
                    value={value}
                    placeholder="Nova Senha"
                    placeholderTextColor={'#8e681a'}
                    style={{color: '#8e681a', fontSize: 18}}
                    secureTextEntry
                    containerStyle={{marginBottom: 10}}
                  />
                )}
                name="newPassword"
              />
              {errors?.newPassword && (
                <View>
                  <Text
                    style={{
                      color: '#D2745A',
                      fontSize: 12,
                    }}>{`${errors.newPassword.message}`}</Text>
                </View>
              )}
              <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <InputPasswordLogin
                    onChangeText={onChange}
                    value={value}
                    placeholder="Confirmar senha"
                    placeholderTextColor={'#8e681a'}
                    style={{color: '#8e681a', fontSize: 18}}
                    secureTextEntry
                    containerStyle={{marginBottom: 10}}
                  />
                )}
                name="confirmNewPassword"
              />
              {errors?.confirmNewPassword && (
                <View>
                  <Text
                    style={{
                      color: '#D2745A',
                      fontSize: 12,
                    }}>{`${errors.confirmNewPassword.message}`}</Text>
                </View>
              )}

              <Button
                buttonStyle={{height: 50}}
                onPress={handleSubmit(save)}
                title={'Salvar'}
              />
            </KeyboardAvoidingView>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
