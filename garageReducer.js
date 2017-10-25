import * as vars from '../constants/garage';
import { findIndex } from 'lodash';

const initialState = {
  items: [],
  isWaiting: false,
  selectedCar: {},
  originalCatalogs: null,
};

export default function garage(state = initialState, action) {
  switch (action.type) {
    /* Получение списка */
    case vars.GARAGE_GET_ITEMS_REQUEST:
      return { ...state, isWaiting: true };
    case vars.GARAGE_GET_ITEMS_SUCCESS: {
      return { ...state, items: action.payload || [], isWaiting: false };
    }
    case vars.GARAGE_GET_ITEMS_FAILURE:
      return { ...state, isWaiting: false };

    /* Получение оригинальных каталогов */
    case vars.GARAGE_GET_ORIGINAL_CATALOG_REQUEST:
      return { ...state };
    case vars.GARAGE_GET_ORIGINAL_CATALOG_SUCCESS: {
      const catalog = {};
      catalog[action.payload.markCode] = action.payload;

      const originalCatalogs = Object.assign({}, state.originalCatalogs, catalog);

      return { ...state, originalCatalogs };
    }
    case vars.GARAGE_GET_ORIGINAL_CATALOG_FAILURE:
      return { ...state };

    /* Получение выбранной машины */
    case vars.GARAGE_GET_SELECT_CAR_REQUEST:
      return { ...state, isWaiting: true };
    case vars.GARAGE_GET_SELECT_CAR_SUCCESS: {
      return { ...state, selectedCar: action.payload || {}, isWaiting: false };
    }
    case vars.GARAGE_GET_SELECT_CAR_FAILURE:
      return { ...state, isWaiting: false };

    /* Добавление машины */
    case vars.GARAGE_ADD_CAR_REQUEST:
      return { ...state, isWaiting: true };
    case vars.GARAGE_ADD_CAR_SUCCESS: {
      const items = Object.assign([], state.items);
      items.push(action.payload);

      return { ...state, items, isWaiting: false };
    }
    case vars.GARAGE_ADD_CAR_FAILURE:
      return { ...state, isWaiting: false };

    /* Удаление машины */
    case vars.GARAGE_REMOVE_CAR_REQUEST:
      return { ...state, isWaiting: true };
    case vars.GARAGE_REMOVE_CAR_SUCCESS: {
      const items = Object.assign([], state.items);
      const removeItemIndex = findIndex(items, item => item.id === action.payload.id);
      const newCar = {};

      if (removeItemIndex !== false) {
        items.splice(removeItemIndex, 1);
      }

      if (state.selectedCar && state.selectedCar.id === action.payload.id) {
        newCar.selectedCar = state.items.length ? items[0] : {};
      }

      return { ...state, items, ...newCar, isWaiting: false };
    }
    case vars.GARAGE_REMOVE_CAR_FAILURE:
      return { ...state, isWaiting: false };

    /* Добавление автомобиля */

    case vars.GARAGE_ADD_CAR: {
      const newCarList = [...state.cars];
      newCarList.push(action.payload);

      return { ...state, cars: newCarList };
    }

    /* Выбор текущего автомобиля */
    case vars.GARAGE_SELECT_REQUEST:
      return { ...state, isWaiting: true };
    case vars.GARAGE_SELECT_SUCCESS: {
      return { ...state, selectedCar: action.payload, isWaiting: false };
    }
    case vars.GARAGE_SELECT_FAILURE:
      return { ...state, isWaiting: false };

    /* Сброс выбора автомобиля */
    case vars.GARAGE_DESELECT_REQUEST:
      return { ...state, isWaiting: true };
    case vars.GARAGE_DESELECT_SUCCESS:
      return { ...state, selectedCar: {}, isWaiting: false };
    case vars.GARAGE_DESELECT_FAILURE:
      return { ...state, isWaiting: false };

    default:
      return state;
  }
}
