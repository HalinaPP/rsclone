import { store } from '@/redux/store/rootStore';
import { AuthUser } from '@/types/types';
import { StatusCodes } from 'http-status-codes';
import {
  setAuthInformation,
  removeAuthInformation,
  userRegistered,
  endGame,
} from '@/redux/actions/actions';
import { browserHistory } from '@/router/history';
import { AUTH_URL, MENU_URL } from '@/router/constants';
import {
  LOGIN_ACTION,
  LOGOUT_ACTION,
  REGISTER_ACTION,
  HEADER_JSON,
  REFRESH_TOKEN,
  AUTH_MESSAGE,
  AUTH_LOGIN_EXISTS_ERROR_STATUS,
} from './constants';
import { parseTokenData, isAccessTokenExpired } from './webToken.service';

const requestInit: RequestInit = {
  method: 'POST',
  headers: HEADER_JSON,
  mode: 'cors',
  cache: 'default',
  credentials: 'include',
  body: '',
};

export const buttonStyleClick = (event:MouseEvent):void =>{
  const element = <HTMLElement>event.target;
  element.classList.add('active');
};

const refreshTokenSession = async (): Promise<boolean> =>
  fetch(REFRESH_TOKEN, requestInit)
    .then(
      (response): Promise<string> => {
        if (response.status !== StatusCodes.OK) {
          throw new Error();
        }
        return response.json();
      },
    )
    .then((bodyValue: string) => {
      const authObj: AuthUser = <AuthUser>JSON.parse(bodyValue);

      if (!authObj.accessToken) {
        return false;
      }

      const { exp } = parseTokenData(authObj.accessToken);
      authObj.tokenExpDate = exp;

      store.dispatch(setAuthInformation(authObj));
      localStorage.setItem('refreshToken', 'true');

      return true;
    })
    .catch(error => {
      throw new Error(error);
    });

export const isUserAuthenticate = async (): Promise<boolean> => {
  const { accessToken } = store.getState().authUser;

  if (accessToken !== '' && !isAccessTokenExpired()) {
    return true;
  }

  if (localStorage.getItem('refreshToken')) {
    await refreshTokenSession();
    return store.getState().authUser.accessToken !== '';
  }

  return false;
};

export const isUserJustRegistered = (): boolean => {
  const user = store.getState().authUser;
  return user.userRegistered;
};

const isConfirmedPassword = (password: string, confirmPassword: string): boolean =>
  password === confirmPassword;

export const handleRegister = (event:MouseEvent): void => {
  const element = <HTMLElement>event.target;
  element.classList.remove('active');

  const name = <HTMLInputElement>document.getElementById('name');
  const login = <HTMLInputElement>document.getElementById('login');
  const password = <HTMLInputElement>document.getElementById('password');
  const confirmPassword = <HTMLInputElement>document.getElementById('confirm-password');
  const message = <HTMLInputElement>document.querySelector('.auth-message');
  
  if (!name.value || !login.value || !password.value || !confirmPassword.value){
    message.innerHTML = AUTH_MESSAGE.badData;
    return;
  }
 
  if (!isConfirmedPassword(password.value, confirmPassword.value)) {
    message.innerHTML = AUTH_MESSAGE.notConfirmedPassword;
    return;
  }
 
  const body = JSON.stringify({ name: name.value, login: login.value, password: password.value });
  requestInit.body = body;
  
  fetch(REGISTER_ACTION, requestInit)
    .then((response): void => {
   
      if (response.status === AUTH_LOGIN_EXISTS_ERROR_STATUS) {
        throw new Error(AUTH_MESSAGE.loginExists);
      } else if (response.status !== StatusCodes.OK) {
        throw new Error();
      }

      message.innerHTML = AUTH_MESSAGE.successRegistration;
      store.dispatch(userRegistered());
    })
    .catch((error:Error) => {
      message.innerHTML = error.message || AUTH_MESSAGE.badData;
    });
};

export const handleLogin = (event:MouseEvent): void => {
  const element = <HTMLElement>event.target;
  element.classList.remove('active');

  const login = <HTMLInputElement>document.getElementById('login');
  const password = <HTMLInputElement>document.getElementById('password');
  const message = <HTMLInputElement>document.querySelector('.auth-message');

  const body = JSON.stringify({ login: login.value, password: password.value });

  requestInit.body = body;

  fetch(LOGIN_ACTION, requestInit)
    .then(
      (response): Promise<string> => {
        if (response.status !== StatusCodes.OK) {
          throw new Error();
        }
        return response.json();
      },
    )
    .then((bodyValue: string) => {
      const authObj: AuthUser = <AuthUser>JSON.parse(bodyValue);

      if (!authObj.accessToken) {
        throw new Error();
      }
      const { exp } = parseTokenData(authObj.accessToken);
      authObj.tokenExpDate = exp;
      store.dispatch(setAuthInformation(authObj));
      localStorage.setItem('refreshToken', 'true');
      browserHistory.push(MENU_URL);
    })
    .catch(() => {
      message.innerHTML = AUTH_MESSAGE.login;
    });
};

export const handleLogout = (): void => {
  const { login } = store.getState().authUser;
  const body = JSON.stringify({ login });

  requestInit.body = body;

  fetch(LOGOUT_ACTION, requestInit)
    .then((): void => {
      store.dispatch(removeAuthInformation(login));
      store.dispatch(endGame());
      localStorage.removeItem('refreshToken');
      browserHistory.push(AUTH_URL);
    })
    .catch(error => {
      throw new Error(error);
    });
};

export const handleClearForm = (): void => {
  const login = <HTMLInputElement>document.getElementById('login');
  const password = <HTMLInputElement>document.getElementById('password');

  login.value = '';
  password.value = '';
};
