import {Icon} from '@rneui/themed';
import {Modal, Text, StyleSheet, TouchableOpacity, View} from 'react-native';

interface IConfirmModalProps {
  isVisible: boolean;
  onCloseRequest: () => void;
}

export default function ConfirmModal({
  isVisible,
  onCloseRequest,
}: IConfirmModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {}}>
      <TouchableOpacity onPress={onCloseRequest} style={styles.confirmModal}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 5,
            marginHorizontal: 15,
            marginBottom: 20,
            padding: 15,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{position: 'absolute', top: 15, right: 15}}
            onPress={onCloseRequest}>
            <Icon name="close" size={30} color={'#ceae7b'} />
          </TouchableOpacity>
          <Icon name="check-circle-outline" size={90} color={'#8ACCCD'} />
          <Text
            style={{
              color: '#000',
              fontWeight: 'bold',
              fontSize: 20,
              textAlign: 'center',
              marginTop: 10,
            }}>
            Reserva feita com sucesso!
          </Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  confirmModal: {
    backgroundColor: 'rgba(0, 0, 0, 0.5);',
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});
