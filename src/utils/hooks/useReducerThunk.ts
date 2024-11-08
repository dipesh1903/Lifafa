import { useCallback, Reducer, ReducerState, ReducerAction, useReducer } from "react";

export type StateGetter<A extends Reducer<any, any>> = () => ReducerState<A>;
export type DispatchThunk<A extends Reducer<any, any>> = (
  dispatch: (value: ReducerAction<A>) => void,
  state?: StateGetter<A>
) => void;
export type DispatcherThunk<A extends Reducer<any, any>> = (
  action: ReducerAction<A> | DispatchThunk<A>
) => void;
export type ActionOrThunk<A extends Reducer<any, any>> =
  | ReducerAction<A>
  | DispatchThunk<A>;

function isDispatchThunk<R extends Reducer<any, any>>(
  action: ReducerAction<R> | DispatchThunk<R>
): action is DispatchThunk<R> {
  
  return typeof action === "function";
}

/**
 * Augments React's useReducer() hook so that the action
 * dispatcher supports thunks.
 */
export function useThunkReducer<R extends Reducer<any, any>>(
  reducer: R,
  initialState: ReducerState<R>,
): [ReducerState<R>, DispatcherThunk<R>] {
  const [state, dispatch] = useReducer(
    reducer,
    initialState
  );

  const getState = useCallback(() => state, [state]);

  const dispatchThunk = (action: ActionOrThunk<R>): void => {
    return isDispatchThunk(action)
      ? action(dispatch, getState)
      : dispatch(action);
  };

  return [state, dispatchThunk];
}