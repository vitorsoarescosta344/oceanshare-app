import {
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {Text} from 'react-native';

export default function BookHomeItem({item}: any) {
  const {width} = useWindowDimensions();

  return (
    <View
      style={{
        height: width * 0.35,
        width: width * 0.8,
        justifyContent: 'space-between',
        borderRadius: 10,
        borderWidth: 1,
      }}></View>
  );
}
