import axios from 'axios';
import {SafeAreaView} from 'react-native-safe-area-context';
import {server} from '../utils/common';
import {useEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Button, Icon} from '@rneui/themed';
import CurrencyFormatter from '../utils/CurrencyFormatter';
import MaintenanceListItem from '../components/MaintenanceListItem';

export default function MaintenanceList({route, navigation}: any) {
  const [list, setList] = useState([]);

  async function loadData() {
    try {
      const {data} = await axios.get(
        `${server}/Expense/GetByQuotaId/${route.params.QuotaId}`,
      );

      setList(data);
    } catch (error) {}
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1, padding: 10}}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
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

        <Text style={{fontSize: 20, fontWeight: '700', color: '#292523'}}>
          Histórico de Manutenções
        </Text>
      </View>

      <ScrollView contentContainerStyle={{padding: 10, gap: 10}}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            color: '#292523',
            marginBottom: 20,
          }}>
          {route.params.QuotaName}
        </Text>
        {list.map((item: any) => (
          <MaintenanceListItem
            item={{
              ...item,
              QuotaName: route.params.QuotaName,
              Holders: item.Holders,
            }}
          />
        ))}
      </ScrollView>
      <View
        style={{
          alignSelf: 'flex-end',
          borderRadius: 4,
          padding: 10,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,

          elevation: 3,
          backgroundColor: '#fff',
          margin: 10,
        }}>
        <Text style={{color: '#000', fontWeight: '700', fontSize: 22}}>
          Total:{' '}
          <Text style={{color: '#00A685'}}>
            R${' '}
            {list.reduce((accumulator, currentValue: any) => {
              return accumulator + currentValue.ValuePerHolder;
            }, 0)}
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
