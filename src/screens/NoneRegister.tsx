import {Icon} from '@rneui/themed';
import {
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {Text} from 'react-native';

export default function NoneRegister(props: any) {
  const {width} = useWindowDimensions();

  return (
    <View
      style={{
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        width: width * 0.9,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
      }}>
      <Icon name="emoji-sad" type="entypo" size={80} color={'#e0e0e0'} />
      <Text
        style={{
          color: '#757575',
          fontWeight: 'bold',
          fontSize: 20,
          marginTop: 10,
          textAlign: 'center',
        }}>
        {props.text}.
      </Text>
    </View>
  );
}
