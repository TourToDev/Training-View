import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/user/userSlice'
import workoutsCollectionReducer from './features/workoutsCollection/workoutsCollectionSlice'
export default configureStore({
  reducer: {
      user:userReducer,
      workoutsCollection:workoutsCollectionReducer,
  }
})