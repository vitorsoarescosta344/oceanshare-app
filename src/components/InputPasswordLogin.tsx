import React from 'react';
import {Icon, useTheme} from '@rneui/themed';
import MaskInput, {Mask} from 'react-native-mask-input';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

interface InputProps extends TextInputProps {
  containerStyle: ViewStyle;
}

const InputPasswordLogin: React.FC<InputProps> = props => {
  const {theme} = useTheme();

  return (
    <View style={[styles.inputContainer, {...props.containerStyle}]}>
      <TextInput
        {...props}
        placeholderTextColor={theme.colors.primary}
        style={{
          flex: 1,
          padding: 0,
          margin: 0,
          color: theme.colors.primary,
          fontSize: 16,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
  },
});

export default InputPasswordLogin;
