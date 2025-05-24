import {Text, TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import CurrencyFormatter from '../utils/CurrencyFormatter';
import {Icon, useTheme} from '@rneui/themed';
import {useState} from 'react';
import React from 'react';

export default function MaintenanceListItem({item}: any) {
  const {theme} = useTheme();

  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => setExpanded(!expanded)}
      style={{
        padding: 10,

        borderColor: '#E5DFDC',
        borderRadius: 8,
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
          justifyContent: 'space-between',
          marginBottom: 10,
        }}>
        <Text style={{fontSize: 16, fontWeight: '700', color: '#000'}}>
          {`${item.QuotaName}: `}
          <Text style={{fontWeight: '400'}}>{item.Description}</Text>
        </Text>
        <Text style={{color: '#00A685', fontSize: 18, fontWeight: '700'}}>
          {CurrencyFormatter(item.ValuePerHolder)}
        </Text>
      </View>
      {expanded && (
        <>
          <Text style={{fontSize: 14, fontWeight: '700', color: '#000'}}>
            Total:{' '}
            <Text style={{fontWeight: '400'}}>
              {CurrencyFormatter(item.ValuePerHolder * item.Holders.length)}
            </Text>
          </Text>
          <Text style={{fontSize: 14, fontWeight: '700', color: '#000'}}>
            {`Divisão entre ${item.Holders.length} cotistas: `}
            <Text style={{fontWeight: '400'}}>
              {CurrencyFormatter(item.ValuePerHolder)}
            </Text>
          </Text>
        </>
      )}
      <View style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
        <Icon
          color={theme.colors.primary}
          type="material-community"
          name={expanded ? 'chevron-up' : 'chevron-down'}
        />
        <Text
          style={{
            color: theme.colors.primary,
            fontSize: 14,
            fontWeight: '500',
          }}>
          Ver Mais
        </Text>
      </View>
    </TouchableOpacity>
  );
}
