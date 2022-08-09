import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';
import { Me, RequiredDeep } from 'ordercloud-javascript-sdk';
import { createOcAsyncThunk } from '../ocReduxHelpers';
import { AppThunkApi } from '../store';
import { cacheProduct, ocProductCacheSelectors } from '../ocProductCache';
import { DBuyerProduct } from 'src/models/ordercloud/DBuyerProduct';
import { DSpec } from 'src/models/ordercloud/DSpec';
import { DVariant } from 'src/models/ordercloud/DVariant';

interface OcProductDetailState {
  error?: SerializedError;
  product?: RequiredDeep<DBuyerProduct>;
  specs?: RequiredDeep<DSpec>[];
  variants?: RequiredDeep<DVariant>[];
}

const initialState: OcProductDetailState = {};

const getProductSpecs = createOcAsyncThunk<RequiredDeep<DSpec>[], string>(
  'ocProductDetail/getSpecs',
  async (productId) => {
    const response = await Me.ListSpecs<DSpec>(productId, { pageSize: 100 });
    return response.Items;
  }
);

const getProductVariants = createOcAsyncThunk<RequiredDeep<DVariant>[], string>(
  'ocProductDetail/getVariants',
  async (productId) => {
    const response = await Me.ListVariants<DVariant>(productId, { pageSize: 100 });
    return response.Items;
  }
);

export const setProductId = createAsyncThunk<RequiredDeep<DBuyerProduct>, string, AppThunkApi>(
  'ocProductDetail/setProductId',
  async (productId, ThunkAPI) => {
    let product = ocProductCacheSelectors.selectById(ThunkAPI.getState(), productId);

    if (!product) {
      product = await Me.GetProduct<DBuyerProduct>(productId);
      ThunkAPI.dispatch(cacheProduct(product));
    }

    if (product.SpecCount > 0) {
      ThunkAPI.dispatch(getProductSpecs(product.ID));
    }

    if (product.VariantCount > 0) {
      ThunkAPI.dispatch(getProductVariants(product.ID));
    }

    return product;
  }
);

const ocProductDetailSlice = createSlice({
  name: 'ocProductDetail',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setProductId.pending, (state) => {
      state.error = undefined;
      state.specs = undefined;
      state.variants = undefined;
      state.product = undefined;
    });
    builder.addCase(setProductId.fulfilled, (state, action) => {
      state.product = action.payload;
    });
    builder.addCase(setProductId.rejected, (state, action) => {
      state.error = action.error;
    });
    builder.addCase(getProductSpecs.fulfilled, (state, action) => {
      state.specs = action.payload;
    });
    builder.addCase(getProductVariants.fulfilled, (state, action) => {
      state.variants = action.payload;
    });
  },
});

export default ocProductDetailSlice.reducer;
