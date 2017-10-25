import * as vars from '../constants/garage';
import HttpProvider from '../api/HttpProvider';
import { REST_URLS } from './../constants/routes';

export function addCar(payload) {
  return {
    type: vars.GARAGE_ADD_CAR,
    payload,
  };
}

export function addItem(payload) {
  return (dispatch) => {
    dispatch({
      type: vars.GARAGE_ADD_CAR_REQUEST,
    });

    return HttpProvider.post(REST_URLS.VEHICLES, payload)
      .then((res) => {
        dispatch(addCarSuccess(res));
        return res;
      }).catch((res) => {
        dispatch(addCarFailure(res));
        throw res;
      });
  };
}

/**
 * Получение списка машин гаража.
 *
 * @param isGuest
 *
 * @returns {HttpProvider}
 */
export function getItems(isGuest = false) {
  return (dispatch) => {
    dispatch({
      type: vars.GARAGE_GET_ITEMS_REQUEST,
    });

    return HttpProvider.getGarage(isGuest).then((res) => {
      dispatch(getItemsSuccess(res));
      return res;
    }).catch((res) => {
      dispatch(getItemsFailure(res));
      throw res;
    });
  };
}

export function getOriginalCatalog(payload) {
  return (dispatch) => {
    dispatch({
      type: vars.GARAGE_GET_ORIGINAL_CATALOG_REQUEST,
    });

    return HttpProvider.getOriginalCatalog(payload.markCode).then((res) => {
      if (res) {
        dispatch(getOriginalCatalogSuccess(res));
      } else {
        dispatch(getOriginalCatalogFailure(res));
      }

      return res;
    }).catch((res) => {
      dispatch(getOriginalCatalogFailure(res));
      return res;
    });
  };
}

/**
 * Получение выбранной машины.
 *
 * @param payload
 *
 * @returns {HttpProvider}
 */
export function getSelectedCar() {
  return (dispatch) => {
    dispatch({
      type: vars.GARAGE_GET_SELECT_CAR_REQUEST,
    });

    return HttpProvider.getGarageSelectCar().then((res) => {
      dispatch(getSelectCarSuccess(res));

      return res;
    }).catch((res) => {
      dispatch(getSelectCarFailure(res));
      return res;
    });
  };
}

/**
 * Выбор машины.
 *
 * @param payload
 *
 * @returns {HttpProvider}
 */
export function select(payload, isLocal = false) {
  return (dispatch) => {
    dispatch({
      type: vars.GARAGE_SELECT_REQUEST,
    });

    localStorage.removeItem(vars.LOCAL_STORAGE_GARAGE_SELECTED_CAR_KEY);

    let promise;

    if (isLocal) {
      promise = new Promise((resolve) => {
        localStorage.setItem(vars.LOCAL_STORAGE_GARAGE_SELECTED_CAR_KEY, JSON.stringify(payload));
        resolve(payload);
      });
    } else {
      const url = `${REST_URLS.VEHICLES}/Active/${payload.id}`;

      promise = HttpProvider.put(url);
    }

    return promise.then((res) => {
      dispatch(selectCarSuccess(payload));
      dispatch(getOriginalCatalog(payload));
      return res;
    }).catch((res) => {
      dispatch(selectCarFailure(payload));
      return res;
    });
  };
}

/**
 * Сброс выбора машины.
 *
 * @param payload
 *
 * @returns {HttpProvider}
 */
export function deselect() {
  return (dispatch) => {
    dispatch({
      type: vars.GARAGE_DESELECT_REQUEST,
    });

    let promise;

    if (localStorage.getItem(vars.LOCAL_STORAGE_GARAGE_SELECTED_CAR_KEY)) {
      promise = new Promise((resolve) => {
        // Надо сбросить и локальное значение.
        localStorage.removeItem(vars.LOCAL_STORAGE_GARAGE_SELECTED_CAR_KEY);
        resolve();
      });
    } else {
      promise = HttpProvider.put(REST_URLS.GARAGE_DEACTIVE_SELECT_CAR);
    }

    return promise.then((res) => {
      dispatch(deselectCarSuccess());
      return res;
    }).catch((res) => {
      dispatch(deselectCarFailure());
      return res;
    });
  };
}

/**
 * Удаление машины из гаража.
 *
 * @param payload
 *
 * @returns {HttpProvider}
 */
export function remove(payload) {
  return (dispatch) => {
    dispatch({
      type: vars.GARAGE_REMOVE_CAR_REQUEST,
    });

    return HttpProvider.remove(`${REST_URLS.VEHICLES}/${payload.id}`).then((res) => {
      dispatch({
        type: vars.GARAGE_REMOVE_CAR_SUCCESS,
        payload,
      });
      return res;
    }).catch((res) => {
      dispatch({
        type: vars.GARAGE_REMOVE_CAR_FAILURE,
        payload,
      });

      return res;
    });
  };
}

/**
 * Успешное получение данных гаража.
 * Вызов события заполнения данных.
 *
 * @param payload
 * @return {{type, payload: *}}
 */
function getItemsSuccess(payload) {
  return {
    type: vars.GARAGE_GET_ITEMS_SUCCESS,
    payload,
  };
}

/**
 * Ошибка получения данных гаража.
 *
 * @param payload
 * @return {{type, payload: *}}
 */
function getItemsFailure(payload) {
  return {
    type: vars.GARAGE_GET_ITEMS_FAILURE,
    payload: { id: payload.id },
  };
}

/**
 * Успешное добавление машины в гараж.
 * Вызов события заполнения данных.
 *
 * @param payload
 * @return {{type, payload: *}}
 */
function addCarSuccess(payload) {
  return {
    type: vars.GARAGE_ADD_CAR_SUCCESS,
    payload,
  };
}

/**
 * Ошибка добавления машины в гараж.
 *
 * @param payload
 * @return {{type, payload: *}}
 */
function addCarFailure(payload) {
  return {
    type: vars.GARAGE_ADD_CAR_FAILURE,
    payload,
  };
}

/**
 * Успешное получение данных о оригинальном каталоге.
 * Вызов события заполнения данных.
 *
 * @param payload
 * @return {{type, payload: *}}
 */
function getOriginalCatalogSuccess(payload) {
  return {
    type: vars.GARAGE_GET_ORIGINAL_CATALOG_SUCCESS,
    payload,
  };
}

/**
 * Ошибка получения данных о оригинального каталога.
 *
 * @param payload
 * @return {{type, payload: *}}
 */
function getOriginalCatalogFailure(payload) {
  return {
    type: vars.GARAGE_GET_ORIGINAL_CATALOG_FAILURE,
    payload,
  };
}

/**
 * Успешное получение данных о выбранном автомобиле.
 * Вызов события заполнения данных.
 *
 * @param payload
 * @return {{type, payload: *}}
 */
function getSelectCarSuccess(payload) {
  return {
    type: vars.GARAGE_GET_SELECT_CAR_SUCCESS,
    payload,
  };
}

/**
 * Ошибка получения данных о выбранном автомобиле.
 *
 * @param payload
 * @return {{type, payload: *}}
 */
function getSelectCarFailure(payload) {
  return {
    type: vars.GARAGE_GET_SELECT_CAR_FAILURE,
    payload,
  };
}

/**
 * Успешная установка текущего автомобиля.
 * Вызов события заполнения данных.
 *
 * @param payload
 * @return {{type, payload: *}}
 */
function selectCarSuccess(payload) {
  return {
    type: vars.GARAGE_SELECT_SUCCESS,
    payload,
  };
}

/**
 * Ошибка выбора автомобиля.
 *
 * @param payload
 * @return {{type, payload: *}}
 */
function selectCarFailure(payload) {
  return {
    type: vars.GARAGE_SELECT_FAILURE,
    payload,
  };
}

/**
 * Успешная отмена выбора автомобиля.
 * Вызов события заполнения данных.
 *
 * @param payload
 * @return {{type, payload: *}}
 */
function deselectCarSuccess() {
  return {
    type: vars.GARAGE_DESELECT_SUCCESS,
  };
}

/**
 * Ошибка отмены выбора автомобиля.
 *
 * @param payload
 * @return {{type, payload: *}}
 */
function deselectCarFailure() {
  return {
    type: vars.GARAGE_DESELECT_FAILURE,
  };
}
