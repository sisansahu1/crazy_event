

const initialState = {
    userid:null,
    tokenid:null,
    events:[],
    viewDetail:false,
    eventIdToDisplay:[],
    bookedEvents:[],
}

const rootReducer = (state=initialState,actions) => {
    if(actions.type==='SET_TOKEN'){
        return{
            ...state,
            userid:actions.payload.userid,
            tokenid:actions.payload.token,
        }
    }
    if(actions.type==='LOGOUT'){
        return{
            ...state,
            userid:null,
            tokenid:null,
        }
    }
    if(actions.type==='ADD_EVENTS'){
        return{
            ...state,
            events:actions.payload.events,
        }
    }
    if(actions.type==='VIEW_EVENTS'){
        return{
            ...state,
            eventIdToDisplay:actions.payload.eventIdToDisplay,
            viewDetail:actions.payload.detail,
        }
    }
    if(actions.type==='ADD_BOOKINGS'){
        return{
            ...state,
            bookedEvents:actions.payload.bookedEvents,
        }
    }
    if(actions.type==='DELETE_BOOKING'){
        return{
            ...state,
            
        }
    }
    return state;
}

export default rootReducer;