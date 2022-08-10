import { defineStore } from "pinia";
import {IColumn} from "../api/models/IColumn";

interface IState {
  columns: IColumn;
}

export const useColumnsStore = defineStore("columns", {
  state: () => {
    return <IState>{
      columns: {},
    };
  },
});
