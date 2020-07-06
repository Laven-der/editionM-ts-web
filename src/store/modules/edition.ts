import {
  getEditionLists,
  updateEditionItem,
  addEditionItem
} from "@/api/edition";
import {
  VuexModule,
  Module,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
// import { getToken, setToken, removeToken } from '@/utils/auth'
import store from "@/store";
interface IErrorLog {
  _id: string;
}

export interface IEditionState {
  editionLists: IErrorLog[];
}
@Module({ dynamic: true, store, name: "edition" })
class Edition extends VuexModule implements IEditionState {
  public editionLists: IErrorLog[] = [];

  @Mutation
  private ADD_EDITION_ITEM(itemData: IErrorLog) {
    this.editionLists.push(itemData);
  }

  @Mutation
  private CHANGE_EDITION_LIST(editionLists: []) {
    this.editionLists = editionLists;
  }

  @Mutation
  private UPDATE_EDITION_ITEM([_id, ...otherArgs]: [string]) {
    for (let v of this.editionLists) {
      if (v._id === _id) {
        v = Object.assign(v, otherArgs);
        break;
      }
    }
  }

  // UPDATE_EDITION_ITEM: (state, { _id, ...otherArgs }) => {
  //     for (let v of state.editionLists) {
  //       if (v._id === _id) {
  //         v = Object.assign(v, otherArgs);
  //         break;
  //       }
  //     }
  //     console.log(state.editionLists, "3333");
  //   },
  //   DEL_EDITION_ITEM: (state, { _id }) => {
  //     state.editionLists.map((item, index) => {
  //       if (item._id === _id) {
  //         state.editionLists.splice(index, 1);
  //       }
  //     });
  //   },
  //   CHANGE_EDITION_LIST: (state, editionLists) => {
  //     state.editionLists = editionLists;
  //   }

  // @Action
  // public async Login(userInfo: { username: string, password: string }) {
  //   let { username, password } = userInfo
  //   username = username.trim()
  //   const { data } = await login({ username, password })
  //   setToken(data.accessToken)
  //   this.SET_TOKEN(data.accessToken)
  // }

  // @Action
  // public ResetToken() {
  //   removeToken()
  //   this.SET_TOKEN('')
  //   this.SET_ROLES([])
  // }
  // 获取用户信息
  //   GetEditionLists({ commit, state }) {
  //     console.log(2222);
  //     return new Promise((resolve, reject) => {
  //       getEditionLists()
  //         .then(response => {
  //           const result = response.result || [];
  //           commit("CHANGE_EDITION_LIST", result);
  //           resolve(response);
  //         })
  //         .catch(error => {
  //           reject(error);
  //         });
  //     });
  //   },
  @Action
  public async GetEditionLists() {
    const { result } = await getEditionLists();
    // if (!result) {
    //   throw Error("Verification failed, please Login again.");
    // }
    // const { result } = data;
    // console.log(data, "-----");
    this.CHANGE_EDITION_LIST(result);
  }

  // @Action
  // public async LogOut() {
  //   if (this.token === '') {
  //     throw Error('LogOut: token is undefined!')
  //   }
  //   await logout()
  //   removeToken()
  //   this.SET_TOKEN('')
  //   this.SET_ROLES([])
  // }
}

// const edition = {
//   state: {
//     editionLists: []
//   },

//   mutations: {
//     ADD_EDITION_ITEM: (state, itemData) => {
//       state.editionLists.push(itemData);
//     },
//     UPDATE_EDITION_ITEM: (state, { _id, ...otherArgs }) => {
//       for (let v of state.editionLists) {
//         if (v._id === _id) {
//           v = Object.assign(v, otherArgs);
//           break;
//         }
//       }
//       console.log(state.editionLists, "3333");
//     },
//     DEL_EDITION_ITEM: (state, { _id }) => {
//       state.editionLists.map((item, index) => {
//         if (item._id === _id) {
//           state.editionLists.splice(index, 1);
//         }
//       });
//     },
//     CHANGE_EDITION_LIST: (state, editionLists) => {
//       state.editionLists = editionLists;
//     }
//   },

//   actions: {
//     // 获取用户信息
//     GetEditionLists({ commit, state }) {
//       console.log(2222);
//       return new Promise((resolve, reject) => {
//         getEditionLists()
//           .then(response => {
//             const result = response.result || [];
//             commit("CHANGE_EDITION_LIST", result);
//             resolve(response);
//           })
//           .catch(error => {
//             reject(error);
//           });
//       });
//     },
//     updateEditionItem({ commit, state }, data) {
//       return new Promise((resolve, reject) => {
//         updateEditionItem(data)
//           .then(response => {
//             const result = response.data || [];
//             commit("UPDATE_EDITION_ITEM", result);
//             resolve(response);
//           })
//           .catch(error => {
//             reject(error);
//           });
//         // resolve(state.editionLists)
//       });
//     },
//     addEditionItem({ commit: object, state: object }, data) {
//       return new Promise((resolve, reject) => {
//         addEditionItem(data)
//           .then(response => {
//             const result = response.data || [];
//             commit("ADD_EDITION_ITEM", result);
//             resolve(response);
//           })
//           .catch(error => {
//             reject(error);
//           });
//         // resolve(state.editionLists)
//       });
//     }
//   }
// };

// export default edition;
export const EditionModule = getModule(Edition);
