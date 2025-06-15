import {Alert} from 'react-native';

const IS_DEV: boolean = false;
const IS_HOM: boolean = false;

export const server = 'https://api-ocean.penguimbyte.online';

export function isDev(): boolean {
  return server.indexOf('homologacao') != -1 && IS_DEV;
}

export function isHom(): boolean {
  return server.indexOf('homologacao') != -1 && IS_HOM;
}

export const ONESIGNAL_ID: string = '5fe1017e-d1df-4db7-9b8b-b88d3132473b';

export const STORAGE_LOGIN_DATA: string = 'STORAGE_LOGIN_DATA';

export function showError(err: any) {
  if (err.response && err.response.data) {
    Alert.alert(
      'Ops! Ocorreu um Problema!',
      `Mensagem: ${JSON.stringify(err.response.data)}`,
    );
  } else {
    Alert.alert('Ops! Ocorreu um Problema!', `Mensagem: ${err}`);
  }
}
