import {Icon, useTheme} from '@rneui/themed';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useCallback, useState} from 'react';
import {useSelector} from 'react-redux';
import {selectUser} from '../redux/slices/authSlice';
import api from '../services/api';
import {object, string} from 'yup';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import ConfirmModalMaintenance from '../components/ConfirmModalMaintenance';

const schema = object({
  title: string().required(),
  description: string().required(),
});

export default function MaintenanceNew({navigation, route}: any) {
  const {theme} = useTheme();

  const [photo, setPhoto] = useState<null | any>(null);

  const [showConfirm, setShowConfirm] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
  });

  const takePhoto = useCallback(async () => {
    const response = await launchCamera({
      includeBase64: true,
      cameraType: 'back',
      mediaType: 'photo',
    });

    if (response?.didCancel) {
      return;
    }

    //@ts-ignore
    setPhoto(`data:image/png;base64,${response.assets[0].base64}`);
  }, []);

  const {width} = useWindowDimensions();

  const user = useSelector(selectUser);

  const onSend = async (data: any) => {
    try {
      const obj = {
        QuotaId: route.params.QuotaId,
        Title: data.title,
        Logs: [
          {
            UserId: user.Id,
            StatusId: 2,
            Observation: data.description,
            Photos: photo == null ? [''] : [photo],
          },
        ],
      };

      await api.post('/Maintenance', obj);

      setShowConfirm(true);
    } catch (error) {
      console.log(error.response);
      Alert.alert('Error');
    }
  };

  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1, padding: 20}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          marginBottom: 20,
        }}>
        <TouchableOpacity
          style={{
            height: 40,
            width: 40,
            backgroundColor: '#fff',
            borderRadius: 5,

            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={30} color={'#ceae7b'} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 22,
            fontWeight: '700',
            color: '#222222',
          }}>
          Registrar Incidência
        </Text>
      </View>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '700',
          color: '#4e4e4e',
        }}>
        Descreva o problema ou incidente a ser registrado
      </Text>
      <View style={{flex: 1, marginTop: 20}}>
        <Text style={{fontWeight: '700', fontSize: 16, marginBottom: 10}}>
          Titulo:
        </Text>
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              onChangeText={onChange}
              value={value}
              style={{
                height: 40,
                backgroundColor: '#fff',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.22,
                shadowRadius: 2.22,

                elevation: 3,
                borderRadius: 4,
                marginBottom: 20,
              }}
              placeholder=""
            />
          )}
          name="title"
        />

        <Text style={{fontWeight: '700', fontSize: 16, marginBottom: 10}}>
          Descrição:
        </Text>
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              onChangeText={onChange}
              value={value}
              style={{
                height: 40 * 6,
                backgroundColor: '#fff',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.22,
                shadowRadius: 2.22,

                elevation: 3,
                borderRadius: 4,
                textAlignVertical: 'top',
                marginBottom: 50,
              }}
              numberOfLines={3}
              placeholder=""
            />
          )}
          name="description"
        />

        <View style={{alignItems: 'center', width: '100%', marginBottom: 20}}>
          <TouchableOpacity
            onPress={takePhoto}
            style={{
              padding: 15,
              justifyContent: 'center',
              alignItems: 'center',
              //backgroundColor: theme.colors.primary,
              borderRadius: 50,
              alignSelf: 'center',
              marginBottom: 5,
            }}>
            {photo == null ? (
              <View
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 4,
                  backgroundColor: '#D9D9D9',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon size={40} color={'#949494'} name="add-a-photo" />
              </View>
            ) : (
              <View style={{alignItems: 'center', gap: 10}}>
                <Image
                  style={{height: 100, width: 100, borderRadius: 4}}
                  source={{uri: photo}}
                />
                <TouchableOpacity
                  style={{
                    height: 40,
                    width: 100,
                    borderRadius: 4,
                    backgroundColor: '#f5f5f5',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => setPhoto(null)}>
                  <Icon
                    name="trash-can-outline"
                    color={'#FF4747'}
                    type="material-community"
                    size={30}
                  />
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={handleSubmit(onSend)}
        style={styles.reserveButton}>
        <Text
          style={{
            fontWeight: '700',
            color: theme.colors.white,
            fontSize: 16,
          }}>
          Finalizar Registro
        </Text>
      </TouchableOpacity>
      <ConfirmModalMaintenance
        isVisible={showConfirm}
        onCloseRequest={() => {
          setShowConfirm(false);
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  back: {
    height: 40,
    width: 40,
    backgroundColor: '#fff',
    borderRadius: 5,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,

    alignSelf: 'center',
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
  },
  reserveButton: {
    flexDirection: 'row',

    borderRadius: 5,

    padding: 10,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
    backgroundColor: '#008234',
    marginTop: 10,
  },
});
