import {useCallback} from 'react';
import {setIsLoggedIn, setUser} from '../redux/slices/authSlice';

import {useDispatch} from 'react-redux';

export function useSignOut() {
  const dispatch = useDispatch();

  const signOut = useCallback(async () => {
    dispatch(setUser(null));
    dispatch(setIsLoggedIn(null));
  }, [dispatch]);

  return signOut;
}
