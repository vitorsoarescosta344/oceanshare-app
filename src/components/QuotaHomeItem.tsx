import {useNavigation} from '@react-navigation/native';
import {Icon} from '@rneui/themed';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {Text} from 'react-native';

export default function QuotaHomeItem({item}: any) {
  const {width} = useWindowDimensions();

  const navigation: any = useNavigation();

  console.log({item});

  return (
    <View style={styles.container}>
      {item.Photos && item.Photos.length > 0 && item.Photos[0].Photo ? (
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() =>
            navigation.navigate('Book', {Id: 0, QuotaId: item.Id})
          }>
          <ImageBackground
            source={{uri: item.Photos[0].Photo}}
            style={{flex: 1}}>
            <View
              style={{
                padding: 15,
                backgroundColor:
                  item.HolderQuantity == 0
                    ? 'rgba(220, 53, 69, 0.75)'
                    : 'rgba(0, 130, 52, 0.75)',
                width: '50%',
                alignSelf: 'flex-end',
                borderTopRightRadius: 4,
                borderBottomLeftRadius: 4,
                alignItems: 'center',
              }}>
              <Text style={{color: '#fff', fontWeight: '500', fontSize: 14}}>
                {item.HolderQuantity == 0
                  ? 'Suas reservas acabaram'
                  : `${item.HolderQuantity} Reservas disponíveis`}
              </Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      ) : (
        <ImageBackground
          source={require('../assets/no-photo.png')}
          style={{flex: 1}}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Book', {Id: 0, QuotaId: item.Id})
            }
            style={{
              padding: 15,
              backgroundColor:
                item.HolderQuantity == 0
                  ? 'rgba(220, 53, 69, 0.75)'
                  : 'rgba(0, 130, 52, 0.75)',
              width: '50%',
              alignSelf: 'flex-end',
              borderTopRightRadius: 4,
              borderBottomLeftRadius: 4,
              alignItems: 'center',
            }}>
            <Text style={{color: '#fff', fontWeight: '500', fontSize: 14}}>
              {item.HolderQuantity == 0
                ? 'Suas reservas acabaram'
                : `${item.HolderQuantity} Reservas disponíveis`}
            </Text>
          </TouchableOpacity>
        </ImageBackground>
      )}

      <View
        style={{
          padding: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 16, fontWeight: '600', color: '#222222'}}>
          {item.QuotaName}
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Details', {Id: 0, QuotaId: item.Id})
          }>
          <Icon
            name="information-outline"
            type="material-community"
            size={35}
            color={'#464646'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: width * 0.6,
    width: width * 0.9,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
