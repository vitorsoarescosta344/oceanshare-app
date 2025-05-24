import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {server, STORAGE_LOGIN_DATA} from '../utils/common';
import api from './api';

export const login = async (cpf, password, onesignalId) => {
  try {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    };
    // const data = {
    //   CPF: cpf,
    //   Password: password,
    //   OnesignalId: onesignalId,
    // };
    const data = {
      CPF: cpf,
      Password: password,
      OnesignalId: onesignalId,
    };

    // const res = await axios.post('http://10.0.2.2:4321/Login/Auth', data, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });

    const res = await api.post('/Login/Auth', data);

    await AsyncStorage.setItem(
      STORAGE_LOGIN_DATA,
      JSON.stringify({cpf, password, onesignalId}),
    );

    await AsyncStorage.setItem(
      'accessToken',
      res.data.Token.TokenAuthorization,
    );

    if (
      res &&
      res.data &&
      res.data.Token &&
      res.data.Token.TokenAuthorization
    ) {
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${res.data.Token.TokenAuthorization}`;
      api.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${res.data.Token.TokenAuthorization}`;
      return res.data.User;
    }
    return null;
  } catch (e) {
    console.log(e);
  }
};
