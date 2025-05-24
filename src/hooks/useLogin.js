import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {setUser, setIsLoggedIn} from '../redux/slices/authSlice';

export default function useLogIn() {
  const dispatch = useDispatch();
  const logIn = useCallback(
    user => {
      dispatch(setUser(user));
      dispatch(setIsLoggedIn(true));
    },
    [dispatch],
  );

  return logIn;
}
