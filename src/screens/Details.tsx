import {Button, Icon, ListItem, useTheme} from '@rneui/themed';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {
  FlatList,
  ImageBackground,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {server} from '../utils/common';
import {selectUser} from '../redux/slices/authSlice';
import {useSelector} from 'react-redux';
import {Text} from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import base64 from 'react-native-base64';
import Loading from '../components/Loading';
import React from 'react';

export default function Details({route, navigation}: any) {
  const [quota, setQuota] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);

  const {width} = useWindowDimensions();

  const {QuotaId, Id} = route.params;

  const user = useSelector(selectUser);

  async function loadData() {
    try {
      setLoading(true);

      const {data} = await axios.get(
        `${server}/Quota/${QuotaId}/${user?.Holder.Id}`,
      );

      let quotaCopy = {...data};

      quotaCopy.Description = base64.decode(data.Description);

      setQuota(quotaCopy);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const {theme} = useTheme();

  function download(id: any) {
    let url = server + '/Quota/Download/' + id;
    const supported = Linking.canOpenURL(url);

    Linking.openURL(url);
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
      <ScrollView>
        <View style={{flex: 1}}>
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
          <View style={{padding: 20}}>
            <View style={styles.titleDetail} />
            <Text style={{fontSize: 20, fontWeight: '700', color: '#292523'}}>
              {quota?.QuotaName}
            </Text>
          </View>
          <View style={{width: '100%', gap: 20}}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('MaintenanceList', {
                  QuotaId,
                  QuotaName: quota.QuotaName,
                  Holders: quota.Holders,
                })
              }
              style={[
                styles.buttonStyle,
                {
                  borderColor: theme.colors.primary,
                },
              ]}>
              <View style={{position: 'absolute', left: 10}}>
                <Icon
                  type="material-community"
                  name="history"
                  color={theme.colors.primary}
                />
              </View>
              <Text
                style={{
                  fontWeight: '700',
                  color: theme.colors.primary,
                  fontSize: 16,
                }}>
                Histórico de Manutenções
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('MaintenanceNew', {
                  QuotaId: route.params.QuotaId,
                })
              }
              style={[
                styles.buttonStyle,
                {
                  borderColor: theme.colors.primary,
                },
              ]}>
              <View style={{position: 'absolute', left: 10}}>
                <Icon
                  type="material-community"
                  name="alert"
                  color={theme.colors.primary}
                />
              </View>
              <Text
                style={{
                  fontWeight: '700',
                  color: theme.colors.primary,
                  fontSize: 16,
                }}>
                Registro de Incidentes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowDocs(!showDocs)}
              style={{
                borderRadius: 5,
                padding: 10,
                paddingVertical: 15,
                width: '90%',
                alignSelf: 'center',
                alignItems: 'center',
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
              <View
                style={{
                  flexDirection: 'row',
                  position: 'relative',
                  width: '100%',
                  justifyContent: 'center',
                }}>
                <View style={{position: 'absolute', left: 0}}>
                  <Icon
                    type="material-community"
                    name="file-document"
                    color={theme.colors.primary}
                  />
                </View>
                <Text
                  style={{
                    fontWeight: '700',
                    color: theme.colors.primary,
                    fontSize: 16,
                  }}>
                  Documentos
                </Text>
                <View style={{position: 'absolute', right: 0}}>
                  <Icon
                    type="material-community"
                    name={showDocs ? 'chevron-up' : 'chevron-down'}
                    color={theme.colors.primary}
                  />
                </View>
              </View>
              <View style={{width: '100%', justifyContent: 'center'}}>
                {showDocs && (
                  <>
                    {quota?.Documents?.map((item: any, index: number) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => download(item.Id)}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: index == 0 ? 15 : 10,
                          width: '100%',
                          alignSelf: 'center',
                        }}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Icon
                            name="dot-single"
                            type="entypo"
                            color={'#000'}
                            size={35}
                          />
                          <Text
                            style={{
                              color: '#747474',
                              fontWeight: 'bold',
                              fontSize: 18,
                            }}>
                            {item.DocumentName}
                          </Text>
                        </View>
                        <Icon
                          name="eye-outline"
                          type="ionicon"
                          size={25}
                          color={'#1E90FF'}
                        />
                      </TouchableOpacity>
                    ))}
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              height: 10,
              width: 30,
              backgroundColor: theme.colors.primary,
              borderRadius: 5,
              marginVertical: 20,
              alignSelf: 'center',
            }}
          />

          <TouchableOpacity
            onPress={() => setShowSpecs(!showSpecs)}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              borderColor: '#E5DFDC',
              padding: 10,
              paddingVertical: 15,
              width: '90%',
              alignSelf: 'center',
              backgroundColor: '#fff',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,

              elevation: 3,
              marginBottom: 20,
              //justifyContent: 'space-evenly',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
                position: 'relative',
                justifyContent: 'space-between',
                width: '100%',
                gap: 20,
              }}>
              <View
                style={{
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  position: 'relative',
                  flexDirection: 'row',
                  marginBottom: showSpecs ? 20 : 0,
                }}>
                <Text
                  style={{
                    fontWeight: '700',
                    color: theme.colors.primary,
                    fontSize: 16,
                  }}>
                  Especificações
                </Text>
                <Icon
                  type="material-community"
                  name={showSpecs ? 'chevron-up' : 'chevron-down'}
                  color={theme.colors.primary}
                />
              </View>
            </View>
            {showSpecs && (
              <AutoHeightWebView
                style={{width: '100%', alignSelf: 'center'}}
                customStyle={'p { font-size: 16px; }'}
                source={{html: quota?.Description || ''}}
              />
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => navigation.navigate('Book', {Id: 0, QuotaId: QuotaId})}
        style={styles.reserveButton}>
        <Text
          style={{
            fontWeight: '700',
            color: theme.colors.white,
            fontSize: 18,
          }}>
          Vamos Agendar sua Reserva?
        </Text>
      </TouchableOpacity>
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
    borderRadius: 5,
    padding: 10,
    paddingVertical: 15,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  reserveButton: {
    flexDirection: 'row',

    padding: 30,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
    backgroundColor: '#008234',
    marginTop: 10,
  },
  titleDetail: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 0,
    backgroundColor: '#8ccccc',
    height: 35,
    width: 7,
    position: 'absolute',
    top: 15,
  },
});
