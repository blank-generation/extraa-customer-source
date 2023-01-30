import { createSlice, configureStore, combineReducers } from '@reduxjs/toolkit'

const pageIndexSlice = createSlice({
  name: 'pageIndex',
  initialState: {
    pageIndex: 0
  },
  reducers: {
    incremented: state => {

      state.pageIndex += 1
    },
    decremented: state => {
      state.pageIndex -= 1
    }
  }
})

const overLayIndexSlice = createSlice({
  name: 'overLay',
  initialState: {
    overLay: false
  },
  reducers: {
    activated: state => {

      state.overLay = true;
    },
    deactivated: state => {
      state.overLay = false;
    }
  }
})

export const { incremented, decremented } = pageIndexSlice.actions
export const { activated, deactivated } = overLayIndexSlice.actions

const allReducers = combineReducers({
  pageIndex: pageIndexSlice.reducer,
  overLay: overLayIndexSlice.reducer
})

export const store = configureStore({
  reducer: pageIndexSlice.reducer
  // overlayReducer: overLayIndexSlice.reducer
})


  // Can still subscribe to the store
  // store.subscribe(() => console.log(store.getState()))

