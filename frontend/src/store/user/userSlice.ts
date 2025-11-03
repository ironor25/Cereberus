import {createSlice} from "@reduxjs/toolkit"


const userSlice= createSlice({
    name: "details",
    initialState: {
        uid: "",
        balance: ""
    },
    reducers:{
        setUID:(state, action)=>{
            state.uid = action.payload
        },
        setBalance: (state, action)=>{
            state.balance = action.payload
        }
    }

})

export const {setUID , setBalance} = userSlice.actions;
export default userSlice.reducer;