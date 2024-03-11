import { useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../providers/AccountStoreProvider';

/**
 * This hook returns a useSelector already typed with `RootState`, for easier consumption
 * and type safety.
 *
 * @returns {Function} A function that acts as selector to the Redux store, typed
 * specifically for `RootState`
 *
 * @example
 * const { stage } = useSelector((state) => state.game[contractTransaction].stage)
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
