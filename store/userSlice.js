import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const updatePassword = createAsyncThunk(
  'user/updatePassword',
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const res = await fetch('/settings/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        return rejectWithValue(data);
      }

      return await res.json();
    } catch {
      return rejectWithValue({ error: 'Сетевая ошибка' });
    }
  },
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ username, bio }, { rejectWithValue }) => {
    try {
      const res = await fetch('/settings/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, bio }),
      });

      if (!res.ok) {
        const data = await res.json();
        return rejectWithValue(data);
      }

      return await res.json();
    } catch (err) {
      return rejectWithValue({ error: 'Сетевая ошибка' });
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
    passwordChangeStatus: 'idle',
    passwordChangeError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.error || 'Ошибка';
      })
      .addCase(updatePassword.pending, (state) => {
        state.passwordChangeStatus = 'loading';
        state.passwordChangeError = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.passwordChangeStatus = 'succeeded';
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.passwordChangeStatus = 'failed';
        state.passwordChangeError = action.payload?.error || 'Ошибка';
      });
  },
});

export default userSlice.reducer;
