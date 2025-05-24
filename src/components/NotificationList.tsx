import {Icon} from '@rneui/themed';
import moment from 'moment';
import {
  Modal,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
} from 'react-native';

interface INotificationListProps {
  isVisible: boolean;
  onCloseRequest: () => void;
  items: any[];
}

export default function NotificationList({
  isVisible,
  onCloseRequest,
  items,
}: INotificationListProps) {
  async function generateList() {
    const notificationList = items;

    if (!notificationList || notificationList.length == 0) return <></>;

    notificationList.sort((a, b) =>
      a.CheckIn > b.CheckIn ? 1 : b.CheckIn > a.CheckIn ? -1 : 0,
    );

    return notificationList.map((n, i) => (
      <View
        key={'Notification' + i}
        style={{
          backgroundColor: 'white',
          borderRadius: 5,
          marginHorizontal: 15,
          marginTop: i == 0 ? 85 : 10,
        }}>
        <View style={{paddingVertical: 15, paddingHorizontal: 10}}>
          <View style={{alignItems: 'baseline'}}>
            {n.StatusId == 1 && (
              <>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}>
                  {`Confirme sua reserva até as ${moment(
                    n.QuotaNotificationHour,
                    'HHmm',
                  ).format('HH:mm')} do dia ${moment(n.LimitDate).format(
                    'DD/MM/YYYY',
                  )}`}
                </Text>
              </>
            )}
            {n.StatusId == 2 && (
              <>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}>
                  Reserva confirmada.
                </Text>
              </>
            )}
          </View>

          <Text style={{color: '#747474', fontSize: 16, marginTop: 10}}>
            {n.Name}: Check in {moment(n.CheckIn).format('DD/MM/YYYY')}
          </Text>
        </View>
      </View>
    ));
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        onCloseRequest;
      }}>
      <TouchableOpacity
        style={styles.notificationModal}
        onPress={onCloseRequest}>
        <TouchableOpacity
          onPress={onCloseRequest}
          style={{
            borderRadius: 10,
            marginLeft: 20,
            backgroundColor: 'white',
            shadowColor: '#000',
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: '#ceae7b',
            alignSelf: 'flex-end',
            marginTop: 25,
            marginRight: 80,
          }}>
          {items && items.length > 0 && (
            <View
              style={{
                backgroundColor: '#ceae7b',
                width: 20,
                height: 20,
                borderRadius: 10,
                position: 'absolute',
                top: -7,
                right: -7,
                alignItems: 'center',
              }}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                {items && items.length}
              </Text>
            </View>
          )}
          <Icon name="notifications-none" size={30} color={'#ceae7b'} />
        </TouchableOpacity>
        <FlatList
          data={items}
          renderItem={({item, index}) => (
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 5,
                marginHorizontal: 15,
                marginTop: index == 0 ? 85 : 10,
              }}>
              <View style={{paddingVertical: 15, paddingHorizontal: 10}}>
                <View style={{alignItems: 'baseline'}}>
                  {item.StatusId == 1 && (
                    <>
                      <Text
                        style={{
                          color: '#000',
                          fontSize: 18,
                          fontWeight: 'bold',
                        }}>
                        {`Confirme sua reserva até as ${moment(
                          item.QuotaNotificationHour,
                          'HHmm',
                        ).format('HH:mm')} do dia ${moment(
                          item.LimitDate,
                        ).format('DD/MM/YYYY')}`}
                      </Text>
                    </>
                  )}
                  {item.StatusId == 2 && (
                    <>
                      <Text
                        style={{
                          color: '#000',
                          fontSize: 18,
                          fontWeight: 'bold',
                        }}>
                        Reserva confirmada.
                      </Text>
                    </>
                  )}
                </View>

                <Text style={{color: '#747474', fontSize: 16, marginTop: 10}}>
                  {item.Name}: Check in{' '}
                  {moment(item.CheckIn).format('DD/MM/YYYY')}
                </Text>
              </View>
            </View>
          )}
        />
        <TouchableOpacity style={{flex: 1}} onPress={onCloseRequest} />
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  notificationModal: {
    backgroundColor: 'rgba(0, 0, 0, 0.5);',
    flexGrow: 1,
  },
});
