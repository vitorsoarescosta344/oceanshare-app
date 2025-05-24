import {Icon, useTheme} from '@rneui/themed';
import {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native';
import {useSelector} from 'react-redux';
import {selectUser} from '../redux/slices/authSlice';
import {server, showError} from '../utils/common';
import axios from 'axios';
import moment from 'moment';
import {useSignOut} from '../hooks/useSignOut';
import Loading from '../components/Loading';
import generateStatusColor from '../utils/generateStatusColor';
import NoneRegister from './NoneRegister';

export default function Books({navigation, route}: any) {
  const {theme} = useTheme();

  const [selected, setSelected] = useState(
    route.params?.screen ? route.params?.screen : 'active',
  );
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [quotaList, setQuotaList] = useState<any[]>([]);

  const user = useSelector(selectUser);

  const signOut = useSignOut();

  async function loadData() {
    try {
      setLoading(true);
      const [quota, book] = await Promise.all([
        axios.get(`${server}/Quota/GetAllWithPhoto/${user?.Holder?.Id}`),
        axios.get(`${server}/Book/GetAll/${user?.Holder?.Id}`),
      ]);

      setQuotaList(quota.data);

      if (selected == 'active') {
        setList(
          book.data.filter(
            (x: any) =>
              moment(x.EndDate).toDate().getTime() >=
                moment().startOf('day').toDate().getTime() && x.StatusId == 1,
          ),
        );
      } else {
        setList(book.data);
      }
    } catch (error: any) {
      if (error.response?.status == 401) {
        signOut();
      } else if (error.response?.status == 404) {
      } else {
        if (error?.response && error?.response?.data?.Errors?.length != 0) {
          let errorMsg = '';
          error?.response?.data?.Errors?.forEach((msg: any) => {
            errorMsg += msg.Message;
          });
          Alert.alert('', errorMsg);
        } else {
          Alert.alert('', error.Message);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [selected]);

  const validateBookingConfirmation = async (id: any) => {
    Alert.alert(
      '',
      'Confirma a reserva?',
      [
        {text: 'Não', style: 'cancel'},
        {text: 'Sim', onPress: () => updateStatus(id, 2)},
      ],
      {cancelable: true},
    );
  };

  const validateBookingCancelation = (id: any) => {
    Alert.alert(
      '',
      'Tem certeza que deseja cancelar a reserva?',
      [
        {text: 'Não', style: 'cancel'},
        {text: 'Sim', onPress: () => updateStatus(id, 3)},
      ],
      {cancelable: true},
    );
  };

  const updateStatus = async (id: any, statusId: number) => {
    try {
      console.log({test: {id, statusId}});
      setLoading(true);
      await axios.put(`${server}/Book/UpdateStatus/${id}/${statusId}`);
      loadData();
    } catch (error: any) {
      console.log({error});
      if (error.response?.status == 401) signOut();

      showError(error.Message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{flex: 1}}>
        <View style={{padding: 20}}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{alignSelf: 'flex-start'}}>
              <Icon
                name="chevron-left"
                size={40}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
            <Text style={{fontSize: 20, fontWeight: '700', color: '#414042'}}>
              Reservas
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => setSelected('active')}
              style={{alignItems: 'center'}}>
              <Text
                style={{
                  color: selected == 'active' ? '#9cc9c9' : '#80736F',
                  fontWeight: '700',
                  fontSize: 17,
                }}>
                Aguardando Confirmação
              </Text>
              <View
                style={{
                  width: 30,
                  height: 6,
                  backgroundColor:
                    selected == 'active' ? theme.colors.primary : '#fff',
                  borderRadius: 3,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelected('history')}
              style={{alignItems: 'center'}}>
              <Text
                style={{
                  color: selected == 'history' ? '#9cc9c9' : '#80736F',
                  fontWeight: '700',
                  fontSize: 17,
                }}>
                Histórico de Reservas
              </Text>
              <View
                style={{
                  width: 30,
                  height: 6,
                  backgroundColor:
                    selected == 'history' ? theme.colors.primary : '#fff',
                  borderRadius: 3,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        {selected === 'active' && (
          <FlatList
            key={'#'}
            data={list}
            ListEmptyComponent={<NoneRegister text={'Nenhum Registro'} />}
            contentContainerStyle={{paddingHorizontal: 20}}
            renderItem={({item}) => {
              let image = require('../assets/no-photo.png');
              const quota = quotaList.find((x: any) => x.Id == item.QuotaId);

              if (quota && quota.Photos != null && quota.Photos.length > 0)
                image = {uri: quota.Photos[0].Photo};

              return (
                <View
                  style={{
                    width: '100%',
                    borderRadius: 5,
                    padding: 20,
                    marginVertical: 10,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.22,
                    shadowRadius: 2.22,
                    elevation: 3,
                    backgroundColor: '#fff',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View style={{flexDirection: 'row', gap: 20}}>
                      <Image source={image} style={{height: 80, width: 80}} />
                      <View>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '700',
                            color: '#414042',
                          }}>
                          {item.QuotaName}
                        </Text>

                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '700',
                            color: '#1976D2',
                          }}>
                          {item.StatusId == 1
                            ? 'Aguardando Confirmação'
                            : item.StatusId == 2
                            ? 'Reservado'
                            : item.StatusId == 3
                            ? 'Cancelado'
                            : item.StatusId == 4
                            ? 'Suplente'
                            : 'Segundo Suplente'}
                        </Text>

                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '700',
                            color: '#7d7a77',
                          }}>
                          Check-in:{' '}
                          <Text
                            style={{
                              fontWeight: '400',
                              fontSize: 14,
                              color: '#4d4a47',
                            }}>
                            {moment(item.StartDate).format('DD/MM/YYYY')}
                          </Text>
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '700',
                            color: '#7d7a77',
                          }}>
                          Check-out:{' '}
                          <Text
                            style={{
                              fontWeight: '400',
                              fontSize: 14,
                              color: '#4d4a47',
                            }}>
                            {moment(item.EndDate).format('DD/MM/YYYY')}
                          </Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                  {item.StatusId == 1 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 20,
                      }}>
                      <TouchableOpacity
                        onPress={() => validateBookingCancelation(item.Id)}
                        style={{
                          width: 130,
                          height: 35,
                          backgroundColor: '#f44336',
                          borderRadius: 4,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text style={{color: '#FFF', fontWeight: '700'}}>
                          Liberar a Data
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => validateBookingConfirmation(item.Id)}
                        style={{
                          width: 130,
                          height: 35,
                          backgroundColor: '#4caf50',
                          borderRadius: 4,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text style={{color: '#FFF', fontWeight: '700'}}>
                          Confirmar
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            }}
          />
        )}
        {selected == 'history' && (
          <FlatList
            key={'@'}
            data={list}
            contentContainerStyle={{paddingHorizontal: 20}}
            ListEmptyComponent={<NoneRegister text={'Nenhum Registro'} />}
            renderItem={({item}) => {
              let image = require('../assets/no-photo.png');
              const quota = quotaList.find((x: any) => x.Id == item.QuotaId);

              if (quota && quota.Photos != null && quota.Photos.length > 0)
                image = {uri: quota.Photos[0].Photo};

              return (
                <View
                  style={{
                    width: '100%',
                    backgroundColor: '#fff',
                    borderRadius: 5,
                    padding: 20,
                    marginVertical: 10,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.22,
                    shadowRadius: 2.22,

                    elevation: 3,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 20,
                      alignItems: 'center',
                    }}>
                    <Image source={image} style={{height: 60, width: 60}} />
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '700',
                          color: '#222222',
                        }}>
                        {item.QuotaName}
                      </Text>

                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '700',
                          color:
                            item.StatusId == 1
                              ? '#1976D2'
                              : item.StatusId == 2
                              ? '#43A047'
                              : item.StatusId == 3
                              ? '#D32F2F'
                              : item.StatusId == 4
                              ? '#fb8c00'
                              : '#fb8c00',
                        }}>
                        {item.StatusId == 1
                          ? 'Aguardando Confirmação'
                          : item.StatusId == 2
                          ? 'Reservado'
                          : item.StatusId == 3
                          ? 'Cancelado'
                          : item.StatusId == 4
                          ? 'Suplencia'
                          : ''}
                      </Text>

                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '700',
                          color: '#7d7a77',
                        }}>
                        Check-in:{' '}
                        <Text
                          style={{
                            fontWeight: '400',
                            fontSize: 14,
                            color: '#4d4a47',
                          }}>
                          {moment(item.StartDate).format('DD/MM/YYYY')}
                        </Text>
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '700',
                          color: '#7d7a77',
                        }}>
                        Check-out:{' '}
                        <Text
                          style={{
                            fontWeight: '400',
                            fontSize: 14,
                            color: '#4d4a47',
                          }}>
                          {moment(item.EndDate).format('DD/MM/YYYY')}
                        </Text>
                      </Text>
                    </View>
                  </View>
                  {item.StatusId != 3 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 20,
                      }}>
                      {new Date(item.StartDate) >= new Date() && (
                        <TouchableOpacity
                          onPress={() => validateBookingCancelation(item.Id)}
                          style={{
                            width: 130,
                            height: 35,
                            backgroundColor: '#f44336',
                            borderRadius: 4,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text style={{color: '#FFF', fontWeight: '700'}}>
                            {item.StatusId == 1 ? 'Liberar a Data' : 'Cancelar'}
                          </Text>
                        </TouchableOpacity>
                      )}
                      {item.StatusId != 2 && (
                        <TouchableOpacity
                          onPress={() => validateBookingConfirmation(item.Id)}
                          style={{
                            width: 130,
                            height: 35,
                            backgroundColor: '#4caf50',
                            borderRadius: 4,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text style={{color: '#FFF', fontWeight: '700'}}>
                            Confirmar
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
