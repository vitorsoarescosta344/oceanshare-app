import axios from 'axios';
import {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {server, showError} from '../utils/common';
import {useSelector} from 'react-redux';
import {selectUser} from '../redux/slices/authSlice';
import moment from 'moment';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {useSignOut} from '../hooks/useSignOut';
import {Alert} from 'react-native';
import {Modal} from 'react-native';
import {Icon, useTheme} from '@rneui/themed';
import {Button} from '@rneui/base';
import ConfirmModal from '../components/ConfirmModal';
import Loading from '../components/Loading';
import generateStatusColor from '../utils/generateStatusColor';

LocaleConfig.locales['pt-Br'] = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  monthNamesShort: [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ],
  dayNames: [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje',
};
LocaleConfig.defaultLocale = 'pt-Br';

export default function Book({route, navigation}: any) {
  const {theme} = useTheme();

  const scrollViewRef = useRef<ScrollView>(null);

  const [loading, setLoading] = useState(false);
  const [quota, setQuota] = useState<any>(null);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [holderId, setHolderId] = useState(0);
  const [baseMarkedDates, setBaseMarkedDates] = useState({});
  const [markedDates, setMarkedDates] = useState({});
  const [listBooks, setListBooks] = useState<any>(null);
  const [book, setBook] = useState({
    Id: 0,
    QuotaId: 0,
    holderId: 0,
    StartDate: null,
    EndDate: null,
  });
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [makeBooking, setMakeBooking] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [idsValid, setIdsValid] = useState(true);
  const [datesValid, setDatesValid] = useState(true);
  const [showMoreDetails, setMoreDetails] = useState(false);

  const {QuotaId, Id} = route.params;

  const user = useSelector(selectUser);

  const signOut = useSignOut();

  const {width} = useWindowDimensions();

  async function loadData() {
    try {
      setLoading(true);

      const [quota, books] = await Promise.all([
        axios.get(`${server}/Quota/${QuotaId}/${user?.Holder.Id}`),
        axios.get(`${server}/Book/GetDatesByQuotaId/${Id}/${QuotaId}`),
      ]);

      const quotaResponse = quota.data;

      const holderId = user?.Holder?.Id || 0;
      let markedDates: any = {};

      const selectedPhoto =
        quotaResponse &&
        quotaResponse.Photos &&
        quotaResponse.Photos.length > 0 &&
        quotaResponse.Photos[0].Id;

      setQuota(quotaResponse);
      setSelectedPhoto(selectedPhoto);
      setHolderId(holderId);

      const listBooks = books.data;

      let dates: any[] = [];
      let bookDates: any[] = [];

      listBooks.forEach((book: any) => {
        //@ts-ignore
        if (quota.BlockedDays) {
          //@ts-ignore
          book.Dates.push(
            //@ts-ignore
            moment(book.EndDate).add(quota.BlockedDays, 'days').toDate(),
          );
        }

        book.Dates.forEach((date: any) => {
          dates.push(date);
        });
      });

      const today = new Date();

      markedDates[moment(today).format('YYYY-MM-DD')] = {
        customStyles: {
          container: {
            backgroundColor: '#1E90FF',
          },
          text: {
            color: 'white',
          },
        },
        selected: true,
      };

      listBooks.forEach((book: any) => {
        markedDates[moment(book.StartDate).format('YYYY-MM-DD')] = {
          customStyles: {
            container: {
              backgroundColor: generateStatusColor(book.StatusId),
            },
            text: {
              color: 'white',
            },
          },
          selected: true,
        };
        markedDates[moment(book.EndDate).format('YYYY-MM-DD')] = {
          customStyles: {
            container: {
              backgroundColor: generateStatusColor(book.StatusId),
            },
            text: {
              color: 'white',
            },
          },
          selected: true,
        };
      });

      setMarkedDates(markedDates);
      setBaseMarkedDates(markedDates);
      setListBooks(listBooks);

      if (Id > 0) {
        const res: any = axios.get(`${server}/Book/${Id}`);

        if (res.data) {
          const book = res.data;
          const currDate = moment(book.StartDate).startOf('day');
          const lastDate = moment(book.EndDate).startOf('day');

          bookDates.push(book.StartDate);
          //@ts-ignore
          if (quota?.IsSequential) {
            bookDates.push(book.EndDate);
            while (currDate.add(1, 'days').diff(lastDate) < 0) {
              bookDates.push(currDate.clone().toDate());
            }
          }

          bookDates.forEach(x => {
            markedDates[moment(x).format('YYYY-MM-DD')] = {
              customStyles: {
                container: {
                  backgroundColor: 'lightblue',
                },
                text: {
                  color: 'black',
                },
              },
            };
          });

          setBook(book);
          setStartDate(book.StartDate);
          setEndDate(book.EndDate);
          setMarkedDates(markedDates);
        }
      }
    } catch (error: any) {
      if (error.response?.status == 401) {
        signOut();
      } else if (
        error?.response &&
        error?.response?.data?.Errors?.length != 0
      ) {
        console.log({error});
        let errorMsg: string = '';
        if (
          error?.response?.data?.Errors[0].Field == 'endDate' ||
          error?.response?.data?.Errors[0].Field == 'startDate'
        ) {
          errorMsg = 'Selecione ao menos uma data!';
        } else {
          error?.response?.data?.Errors?.forEach((msg: string) => {
            errorMsg += msg;
          });
        }
        Alert.alert('', errorMsg);
      } else {
        Alert.alert('', error.Message);
      }
    } finally {
      setLoading(false);
      setMakeBooking(user?.Status);
    }
  }

  async function validate() {
    const idsIsValid = holderId > 0;
    const datesIsValid = startDate !== null && startDate != '';

    setIdsValid(idsIsValid);
    setDatesValid(datesIsValid);

    if (datesIsValid && idsIsValid) {
      await save();
    } else if (!datesIsValid) {
      showError('Selecione ao menos uma data!');
    }
  }

  async function save() {
    if (!startDate) {
      showError('Selecione pelo menos uma data');
      return;
    }

    setLoading(true);

    try {
      if (Id != 0) {
        await axios.put(`${server}/Book/${Id}`, {
          ...book,
          QuotaId: QuotaId,
          holderId,
          StartDate: moment(startDate).format('YYYY-MM-DD'),
          EndDate: moment(endDate ?? startDate).format('YYYY-MM-DD'),
        });
      } else {
        await axios.post(`${server}/Book`, {
          ...book,
          QuotaId: QuotaId,
          ManagerId: user?.Holder.ManagerId,
          holderId,
          StartDate: moment(startDate).format('YYYY-MM-DD'),
          EndDate: moment(endDate ?? startDate).format('YYYY-MM-DD'),
        });
      }

      loadData();
      setModalVisible(true);
    } catch (error: any) {
      console.log({error: error.response});
      if (error.response?.status == 401) signOut();
      else if (error.response?.status == 422) {
        let errorMsg = '';
        error?.response?.data?.Errors?.forEach((msg: any) => {
          errorMsg += msg.Message;
        });

        console.log({errorMsg});

        Alert.alert('Mensagem', errorMsg);
      } else {
        showError('Selecione pelo menos uma data');
      }
    } finally {
      setLoading(false);
    }
  }

  function selectDay(day: any) {
    let markedDatesCopy: any = {...baseMarkedDates};

    const formattedDate = moment(day.dateString).format('YYYY-MM-DD');

    if (
      markedDatesCopy.hasOwnProperty(formattedDate) &&
      markedDatesCopy[formattedDate].StatusId
    ) {
      return;
    }

    setStartDate(moment(formattedDate).format('YYYY-MM-DD'));

    markedDatesCopy[moment(day.dateString).format('YYYY-MM-DD')] = {
      customStyles: {
        container: {
          backgroundColor: '#D3D3D3',
        },
        text: {
          color: 'white',
        },
      },
    };

    setMarkedDates(markedDatesCopy);
  }

  function filterSelected(obj: any) {
    return Object.keys(
      Object.fromEntries(
        Object.entries(obj).filter((x: any) => !x[1].selected),
      ),
    ).length;
  }

  function filterExists(obj: any, date: any) {
    // @@@ Aqui tem que validar para o usuário logado e não para todas as reservas.
    return (
      Object.keys(
        Object.fromEntries(
          Object.entries(obj).filter(
            (x: any) =>
              moment(x[0], 'YYYY-MM-DD').toDate().getTime() ==
                moment(date, 'YYYY-MM-DD').toDate().getTime() && x[1].selected,
          ),
        ),
      ).length != 0
    );
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd();
  }, []);

  if (loading) {
    return <Loading />;
  }

  console.log({quota});

  console.log({condicao: quota?.Photos.lenght > 0});

  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
      <ScrollView ref={scrollViewRef}>
        <View style={{flex: 1}}>
          {quota?.Photos.lenght > 0 ? (
            <FlatList
              horizontal
              data={quota?.Photos}
              renderItem={({item}) => (
                <ImageBackground
                  style={{
                    width: width,
                    height: 190,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                  }}
                  source={{uri: item.Photo}}>
                  <TouchableOpacity
                    style={styles.back}
                    onPress={() => navigation.goBack()}>
                    <Icon name="chevron-left" size={30} color={'#ceae7b'} />
                  </TouchableOpacity>
                </ImageBackground>
              )}
            />
          ) : (
            <ImageBackground
              style={{
                width: '100%',
                height: 190,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              }}
              source={require('../assets/no-photo.png')}>
              <TouchableOpacity
                style={styles.back}
                onPress={() => navigation.goBack()}>
                <Icon name="chevron-left" size={30} color={'#ceae7b'} />
              </TouchableOpacity>
            </ImageBackground>
          )}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 20,
            }}>
            <View style={{flex: 1}}>
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 15,
                  marginLeft: -20,
                }}>
                <View
                  style={{
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 10,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 0,
                    backgroundColor: theme.colors.primary,
                    height: 35,
                    width: 7,
                    position: 'absolute',
                  }}
                />
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: 'bold',
                    color: '#22222',
                  }}>
                  {quota?.Nickname}
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 18,
                  color: theme.colors.primary,
                  marginLeft: 15,
                  marginTop: 10,
                }}>
                {quota?.QuotaName}
              </Text>

              <Text style={{fontSize: 14, color: '#747474', marginLeft: 15}}>
                {!quota?.Weekly &&
                  quota?.HolderQuantity + ' Reservas disponíveis'}
              </Text>
            </View>
          </View>
          <View style={styles.calendarContainer}>
            <Calendar
              theme={{
                arrowColor: '#000',
                monthTextColor: theme.colors.primary,
                textMonthFontWeight: 'bold',
                textDayStyle: {
                  color: '#000',
                },
              }}
              markingType={'custom'}
              onDayPress={(day: any) => selectDay(day)}
              markedDates={markedDates}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginLeft: 25,
              alignItems: 'center',
            }}>
            <Icon name="circle" size={18} color={'#FF0000'} />
            <Text style={{fontSize: 18, color: '#000', marginLeft: 5}}>
              Indisponível
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginLeft: 25,
              alignItems: 'center',
              marginTop: 5,
            }}>
            <Icon name="circle" size={18} color={'#FFA500'} />
            <Text style={{fontSize: 18, color: '#000', marginLeft: 5}}>
              Suplência Disponível
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginLeft: 25,
              alignItems: 'center',
              marginTop: 5,
              marginBottom: 25,
            }}>
            <Icon name="circle" size={18} color={'#1E90FF'} />
            <Text style={{fontSize: 18, color: '#000', marginLeft: 5}}>
              Reserva do Dia Disponível
            </Text>
          </View>
          {showMoreDetails && (
            <Button
              containerStyle={{width: '90%', alignSelf: 'center'}}
              buttonStyle={{backgroundColor: '#008234'}}
              onPress={() => {
                // if (!makeBooking) {
                //   Alert.alert(
                //     'Usuário inadimplente.',
                //     'Não é possível fazer reservas.',
                //   );
                //   return;
                // }
                validate();
              }}
              title={'Reservar'}
            />
          )}

          <TouchableOpacity
            style={styles.moreDetailsButton}
            onPress={() => setMoreDetails(!showMoreDetails)}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',

                justifyContent: 'center',
              }}>
              <Text style={{color: theme.colors.primary}}>
                Mostrar reservas
              </Text>
              <View style={{position: 'absolute', right: 10}}>
                <Icon
                  color={'#8E681A'}
                  type="material-community"
                  name={showMoreDetails ? 'chevron-up' : 'chevron-down'}
                />
              </View>
            </View>
            {showMoreDetails && listBooks && listBooks.length > 0 && (
              <View style={{alignSelf: 'flex-start'}}>
                <View style={{padding: 20}}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '700',
                      color: theme.colors.primary,
                    }}>
                    Datas confirmadas:{' '}
                  </Text>
                  {listBooks
                    .filter((item: any) => item.StatusId == 2)
                    .sort((a: any, b: any) =>
                      a.StartDate > b.StartDate
                        ? 1
                        : b.StartDate > a.StartDate
                        ? -1
                        : 0,
                    )
                    .map((item: any) => (
                      <Text style={{fontSize: 14, fontWeight: '500'}}>
                        {moment(item.StartDate).format('DD/MM/YYYY')} -{' '}
                        {item.HolderName}
                      </Text>
                    ))}
                </View>
                <View style={{padding: 20}}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '700',
                      color: '#9cc9c9',
                    }}>
                    Datas pré reservadas:{' '}
                  </Text>
                  {listBooks
                    .filter((item: any) => item.StatusId == 1)
                    .sort((a: any, b: any) =>
                      a.StartDate > b.StartDate
                        ? 1
                        : b.StartDate > a.StartDate
                        ? -1
                        : 0,
                    )
                    .map((item: any) => (
                      <Text style={{fontSize: 14, fontWeight: '500'}}>
                        {moment(item.StartDate).format('DD/MM/YYYY')} -{' '}
                        {item.HolderName}
                      </Text>
                    ))}
                </View>
              </View>
            )}
          </TouchableOpacity>
          {!showMoreDetails && (
            <Button
              containerStyle={{width: '90%', alignSelf: 'center'}}
              buttonStyle={{backgroundColor: '#008234'}}
              onPress={() => {
                // if (!makeBooking) {
                //   Alert.alert(
                //     'Usuário inadimplente.',
                //     'Não é possível fazer reservas.',
                //   );
                //   return;
                // }
                validate();
              }}
              title={'Reservar'}
            />
          )}

          {/* <TouchableOpacity
            onPress={() => {
              if (!makeBooking) {
                Alert.alert(
                  'Usuário inadimplente.',
                  'Não é possível fazer reservas.',
                );
                return;
              }
              //this.validate();
            }}
            style={[{backgroundColor: '#89D9AA', marginTop: 25}]}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>
              Reservar
            </Text>
          </TouchableOpacity> */}

          <View style={{marginBottom: 20}}></View>

          <ConfirmModal
            isVisible={modalVisible}
            onCloseRequest={() => setModalVisible(false)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  confirmModal: {
    backgroundColor: 'rgba(0, 0, 0, 0.5);',
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  calendarContainer: {
    //margin: 20,
    backgroundColor: 'white',

    borderRadius: 5,

    marginBottom: 10,
  },
  back: {
    height: 40,
    width: 40,
    backgroundColor: '#fff',
    borderRadius: 5,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreDetailsButton: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#8ccccc',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
});
