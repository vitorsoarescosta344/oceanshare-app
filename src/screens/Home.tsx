import {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {selectUser} from '../redux/slices/authSlice';
import {Avatar, Icon, useTheme} from '@rneui/themed';
import {useSignOut} from '../hooks/useSignOut';
import axios from 'axios';
import {server, STORAGE_LOGIN_DATA} from '../utils/common';
import moment from 'moment';
import QuotaHomeItem from '../components/QuotaHomeItem';
import BookHomeItem from '../components/BookHomeItem';
import NoneRegister from './NoneRegister';
import NotificationList from '../components/NotificationList';
import ProfileModal from '../components/ProfileModal';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import Loading from '../components/Loading';
import {login} from '../services/auth.service';

export default function Home({navigation}: {navigation: any}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const [modalProfileVisible, setModalProfileVisible] = useState(false);
  const [booksList, setBooksList] = useState([]);
  const [quotaList, setQuotaList] = useState<any[]>([]);
  const [profilePhoto, setProfilePhoto] = useState();
  const [loading, setLoading] = useState(false);

  const {width, height} = useWindowDimensions();

  const user = useSelector(selectUser);

  const signOut = useSignOut();

  const {theme} = useTheme();

  const dispatch = useDispatch();

  async function refreshToken() {
    try {
      setLoading(true);
      const logindata = await AsyncStorage.getItem(STORAGE_LOGIN_DATA);
      if (logindata !== null) {
        const object = JSON.parse(logindata);

        const userData = await login(
          object.cpf,
          object.password,
          object.onesignalId,
        );
      }
      console.log('login ok');
    } catch (error) {
      console.log(error);
      signOut();
    } finally {
      setLoading(false);
    }
  }

  async function loadData() {
    if (!user) {
      signOut();
    }

    if (user.AlterPassword) {
    }

    const accessToken = await AsyncStorage.getItem('accessToken');

    try {
      setLoading(true);
      const [quota, books] = await Promise.all([
        axios.get(`${server}/Quota/GetAllWithPhoto/${user?.Holder.Id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
        axios.get(`${server}/Book/GetAll/${user?.Holder?.Id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      ]);

      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      setQuotaList(quota.data);

      if (books.data) {
        let booksArray = books.data.filter(
          (x: any) =>
            moment(x.EndDate).toDate().getTime() >=
              moment().startOf('day').toDate().getTime() && x.StatusId != 3,
        );

        let notifyList: any = [];

        booksArray
          .filter((x: any) => x.StatusId < 3)
          .forEach((x: any, i: any) => {
            // Só colocar na lista de notificação as reservas que tem notificação
            let endTime = moment(
              x.QuotaNotificationHour - x.NotifyHolder,
              'HHmm',
            );
            let inTime = endTime.isBefore(moment());

            if (
              (x.StatusId == 1 || x.StatusId == 2) &&
              !inTime &&
              moment(x.StartDate).format('YYYY-MM-DD') ==
                moment().format('YYYY-MM-DD')
            ) {
              notifyList.push({
                Id: x.Id,
                StatusId: x.StatusId,
                LimitDate: moment(x.StartDate).toDate(),
                Name: x.Nickname,
                CheckIn: moment(x.StartDate).toDate(),
                QuotaNotificationHour: x.QuotaNotificationHour,
                NotifyHolder: x.NotifyHolder,
              });
            }
          });

        setNotificationList(notifyList);
        setBooksList(booksArray);
      }
    } catch (error: any) {
      console.log(error);
      if (error.response?.status === 401) {
        console.log(error);
        await refreshToken();
      }
    } finally {
      setLoading(false);
    }
  }

  async function fetchData() {
    await refreshToken();
    await loadData();
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    console.log('Teste');
    setProfilePhoto(user?.Photo);
  }, [modalProfileVisible]);

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            padding: 20,
            gap: 10,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => setNotificationVisible(!notificationVisible)}
              style={[styles.notificationButton, {display: 'none'}]}>
              {notificationList && notificationList.length > 0 && (
                <View
                  style={{
                    backgroundColor: '#ceae7b',
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    position: 'absolute',
                    top: -7,
                    right: -7,
                    alignItems: 'center',
                  }}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>
                    {notificationList && notificationList.length}
                  </Text>
                </View>
              )}
              <Icon name="notifications-none" size={30} color={'#ceae7b'} />
            </TouchableOpacity>
            {profilePhoto == null ? (
              <TouchableOpacity onPress={() => setModalProfileVisible(true)}>
                <Image
                  source={require('../assets/no-photo.png')}
                  style={{height: 50, width: 50}}
                />
              </TouchableOpacity>
            ) : (
              <Avatar
                onPress={() => setModalProfileVisible(true)}
                size={50}
                rounded
                source={{uri: profilePhoto}}
              />
            )}
          </View>
          <View>
            <Text style={{fontWeight: '700', fontSize: 16, color: '#222222'}}>
              Seja bem-vindo!
            </Text>
            <Text
              style={{
                fontWeight: '700',
                fontSize: 20,
                color: theme.colors.primary,
              }}>
              {user?.Name.split(' ')[0]}
            </Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', paddingHorizontal: 20}}>
          <View style={styles.titleDetail} />
          <Text style={{fontSize: 25, fontWeight: 'bold', color: '#222222'}}>
            Cotas
          </Text>
        </View>

        <View>
          <FlatList
            style={{}}
            contentContainerStyle={{gap: 10, padding: 20}}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={quotaList}
            renderItem={({item}) => <QuotaHomeItem item={item} />}
            ListEmptyComponent={
              <NoneRegister text={'Poxa, você não possui propriedades'} />
            }
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={styles.titleDetail} />
          <Text style={{fontSize: 25, fontWeight: 'bold', color: '#222222'}}>
            Reservas
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Books')}
            style={styles.viewMoreButtonStyle}>
            <Text
              style={{
                color: theme.colors.primary,
                fontWeight: '400',
                fontSize: 18,
              }}>
              Ver mais
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          style={{
            marginVertical: 20,
            height: '100%',
            marginBottom: 40,
            paddingBottom: 20,
          }}
          showsHorizontalScrollIndicator={false}
          data={booksList}
          contentContainerStyle={{
            gap: 10,
            padding: 20,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({item}: any) => {
            let image = require('../assets/no-photo.png');
            const quota = quotaList.find((x: any) => x.Id == item.QuotaId);

            if (quota && quota.Photos != null && quota.Photos.length > 0)
              image = {uri: quota.Photos[0].Photo};

            return (
              <TouchableOpacity
                disabled={item.StatusId == 3}
                onPress={() =>
                  navigation.navigate('Books', {
                    screen: item.StatusId == 1 ? 'active' : 'history',
                  })
                }
                style={{
                  width: '100%',
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: '#e5dfdc',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                  backgroundColor: '#fff',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.22,
                  shadowRadius: 2.22,

                  elevation: 3,
                }}>
                <Image
                  style={{width: 60, height: 60, borderRadius: 10}}
                  source={image}
                />
                <View style={{paddingHorizontal: 10, paddingVertical: 5}}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: '#222222',
                    }}>
                    {quota?.QuotaName}
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
                          : item.statusId == 4
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
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <NoneRegister text={'Poxa, você não possui reservas'} />
          }
        />

        <NotificationList
          items={notificationList}
          onCloseRequest={() => setNotificationVisible(false)}
          isVisible={notificationVisible}
        />
        <ProfileModal
          onCloseRequest={() => setModalProfileVisible(false)}
          isVisible={modalProfileVisible}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleDetail: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 0,
    backgroundColor: '#8ccccc',
    height: 35,
    width: 7,
    position: 'absolute',
  },
  showMoreButton: {
    marginLeft: 20,
    borderWidth: 1,
    borderColor: '#ceae7b',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    width: '30%',
  },
  notificationButton: {
    borderRadius: 10,
    marginLeft: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ceae7b',
  },
  viewMoreButtonStyle: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
});
