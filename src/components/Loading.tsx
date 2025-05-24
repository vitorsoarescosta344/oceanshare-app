import {
  ActivityIndicator,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function Loading() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ffff',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 150,
      }}>
      {/* <ActivityIndicator color={'#000'} /> */}
      <View>
        <Image
          source={require('../assets/loading-gif.gif')}
          style={{height: 250, width: 250}}
        />
        <View style={{alignItems: 'center', gap: 10}}>
          <Text style={{fontSize: 18, fontWeight: '500', color: '#222222'}}>
            Carregando...
          </Text>
        </View>
      </View>
      <Image
        source={require('../assets/Ocean-transparente.png')}
        style={{width: 150, height: 150}}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    //marginTop: Dimensions.get('window').width / 2 - 30,
  },
  loadingContainer: {
    marginTop: 50,
  },
  logo: {
    width: '100%',
    resizeMode: 'contain',
  },
});
