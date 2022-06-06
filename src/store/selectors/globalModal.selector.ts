import { createSelector } from "reselect";

// types
import { RootState } from "store/_types";

const getGlobalModalState = (state: RootState) => state.globalModal;

const isOpenAddUserChannel = createSelector(
  [getGlobalModalState],
  (globalModal) => globalModal.isOpenAddUserChannel
);

const globalModalSelectors = { isOpenAddUserChannel };

export default globalModalSelectors;
