import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:3000/me', {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`Ошибка ${res.status}`);
      }

      const data = await res.json();
      return data; // { profile: {...}, posts: [...] }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateEmail = createAsyncThunk(
  'user/updateEmail',
  async ({ newEmail, password }, { rejectWithValue }) => {
    try {
      const res = await fetch('/settings/email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ newEmail, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data.error || 'Ошибка');
      }

      return data;
    } catch (err) {
      return rejectWithValue('Сетевая ошибка');
    }
  },
);

export const updatePassword = createAsyncThunk(
  'user/updatePassword',
  async ({ oldPassword, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const res = await fetch('/settings/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
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
  async ({
    username, nickname, bio, geo, site, birthday, avatarUrl,
  }, { rejectWithValue }) => {
    try {
      const res = await fetch('/settings/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username, nickname, bio, geo, site, birthday, avatarUrl,
        }),
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
    profile: null,
    posts: [],
    loading: false,
    status: 'idle',
    error: null,
    passwordChangeStatus: 'idle',
    passwordChangeError: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (state.profile) {
          state.profile = {
            ...state.profile,
            ...action.payload,
          };
        } else {
          state.profile = action.payload;
        }

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
      })
      .addCase(updateEmail.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateEmail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (state.user) {
          state.user.email = action.payload.email;
        }
      })
      .addCase(updateEmail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Ошибка';
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile;
        state.posts = action.payload.posts;
        state.user = action.payload.profile;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
