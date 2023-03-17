import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { fireDB } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import moment from "moment";

// firebase 데이터베이스 연동
// firebase Storage 이름
const firebaseStorageName = "tsmemo";
// 컬렉션(DataBase 단위 : MongoDB 참조) 불러오기
const memoCollectionRef = collection(fireDB, firebaseStorageName);

// 데이터베이스 읽기
export const getTodoFB = createAsyncThunk(
  "todo/getTodo",
  async (_, thunkAPI) => {
    try {
      const q = await query(memoCollectionRef);
      const data = await getDocs(q);
      if (data !== null) {
        const firebaseData = data.docs.map((doc) => ({
          ...doc.data(),
        }));
        const initData = firebaseData.map((item) => {
          return item as TodoType;
        });
        return initData;
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);
// 목록 추가
export const addTodoFB = createAsyncThunk(
  "todo/addTodo",
  async (tempTodo: TodoType, thunkAPI) => {
    try {
      const res = await setDoc(doc(fireDB, firebaseStorageName, tempTodo.uid), {
        uid: tempTodo.uid,
        title: tempTodo.title,
        body: tempTodo.body,
        date: tempTodo.date,
        sticker: tempTodo.sticker,
        done: false,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);
// 목록 업데이트
export const updateTodoFB = createAsyncThunk(
  "todo/updateTodo",
  async (tempTodo: TodoType, thunkAPI) => {
    try {
      const userDoc = doc(fireDB, firebaseStorageName, tempTodo.uid);
      const res = await updateDoc(userDoc, {
        title: tempTodo.title,
        body: tempTodo.body,
        sticker: tempTodo.sticker,
        done: tempTodo.done,
        date: moment(tempTodo.date).format("YYYY-MM-DD"),
      });
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);
// 목록 삭제
export const deleteTodoFB = createAsyncThunk(
  "todo/deleteTodo",
  async (tempTodo: TodoType, thunkAPI) => {
    try {
      const userDoc = doc(fireDB, firebaseStorageName, tempTodo.uid);
      try {
        const res = await deleteDoc(userDoc);
        console.log(res); // res는 undefined
      } catch (e) {
        console.log(e);
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);
// 목록 검색
export const sortTodoFB = createAsyncThunk(
  "todo/sortTodo",
  async (sortType: string, thunkAPI) => {}
);
// 전체삭제
export const clearTodoFB = createAsyncThunk(
  "todo/clearTodo",
  async (tempTodo: TodoType, thunkAPI) => {
    try {
      // firebase 데이터 1개 삭제
      const userDoc = doc(fireDB, firebaseStorageName, tempTodo.uid);
      try {
        const res = await deleteDoc(userDoc);
        // console.log(res); // res는 undefined
      } catch (e) {
        console.log(e);
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

// 초기 값 타입 정의
type TodoType = {
  uid: string;
  title: string;
  body: string;
  done: boolean;
  sticker: string;
  date: string;
};

// 초기 initial 값에 대한 타입
export type TodoState = {
  todoList: Array<TodoType>;
};

const initialState: TodoState = {
  todoList: [],
};

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  // 동기 reducer : 즉시 실행
  reducers: {
    initTodoState: (state, action: PayloadAction<Array<TodoType>>) => {
      state.todoList = action.payload;
    },
    addTodoState: (state, action: PayloadAction<TodoType>) => {
      // todoList: Array<TodoType>;
      state.todoList.push(action.payload);
    },
    updateTodoState: (state, action: PayloadAction<TodoType>) => {
      // 1. 먼저 uid 를 비교해서 배열의 순서에 맞는 1개를 찾는다.
      const index = state.todoList.findIndex(
        (item) => item.uid === action.payload.uid
      );
      // 2. 해당하는 uid 의 내용을 갱신한다.
      state.todoList[index] = { ...action.payload };
    },
    deleteTodoState: (state, action: PayloadAction<TodoType>) => {
      // 1. 먼저 uid 를 비교해서 배열의 순서에 맞는 1개를 찾는다.
      const index = state.todoList.findIndex(
        (item) => item.uid === action.payload.uid
      );
      // 2. 해당하는 uid 의 내용을 삭제한다.
      state.todoList.splice(index, 1);
    },
    sortTodoState: (state, action: PayloadAction<string>) => {},
    clearTodoState: (state) => {
      state.todoList = [];
    },
  },
  // 비동기 reducer : 서버 실행
  extraReducers: (builder) => {
    builder
      // 전체자료 호출
      // pending : 서버 연결
      .addCase(getTodoFB.pending, (state, action) => {
        console.log("getTodoFB.pending");
      })
      // fulfilled : 데이터 회신
      .addCase(getTodoFB.fulfilled, (state, action) => {
        console.log("getTodoFB.fulfilled");
        // 자료형을 변환해서 저장해야한다. typeScript
        state.todoList = action.payload as Array<TodoType>;
      })
      // rejected : 데이터 오류
      .addCase(getTodoFB.rejected, (state, action) => {
        console.log("getTodoFB.rejected");
      })
      // 할일 추가
      .addCase(addTodoFB.pending, (state, action) => {})
      .addCase(addTodoFB.fulfilled, (state, action) => {})
      .addCase(addTodoFB.rejected, (state, action) => {})
      // 수정
      .addCase(updateTodoFB.pending, (state, action) => {})
      .addCase(updateTodoFB.fulfilled, (state, action) => {})
      .addCase(updateTodoFB.rejected, (state, action) => {})
      // 삭제
      .addCase(deleteTodoFB.pending, (state, action) => {})
      .addCase(deleteTodoFB.fulfilled, (state, action) => {})
      .addCase(deleteTodoFB.rejected, (state, action) => {})
      // 정렬
      .addCase(sortTodoFB.pending, (state, action) => {})
      .addCase(sortTodoFB.fulfilled, (state, action) => {})
      .addCase(sortTodoFB.rejected, (state, action) => {})
      // 전체 삭제
      .addCase(clearTodoFB.pending, (state, action) => {})
      .addCase(clearTodoFB.fulfilled, (state, action) => {})
      .addCase(clearTodoFB.rejected, (state, action) => {});
  },
});

export const {
  initTodoState,
  addTodoState,
  updateTodoState,
  deleteTodoState,
  sortTodoState,
  clearTodoState,
} = todoSlice.actions;
export default todoSlice.reducer;
