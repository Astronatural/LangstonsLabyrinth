const updateReducer = (state = [], action) => {   //  tried; {} = game.map is not a function. [], [{}] = game undefined.
    switch (action.type) {
        case 'SET_INFO':
            console.log(state, action.payload);
            return {state}, action.payload;
        // case 'SET_GAMES':
        //     console.log(action.payload);
        //     return action.payload;
        // case 'SET_GAMEBOARD':
        //     // console.log(action.payload);  // the right stuff!
        //     return [...state], action.payload;
        // // case 'UPDATE_GAMEBOARD':
        // //     return state, action.payload;  //  do I need to spread it when it goes to DB?  Tried [...state]
        default:
            return state;
    }
};

export default updateReducer;