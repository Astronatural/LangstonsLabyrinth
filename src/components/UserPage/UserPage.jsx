import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './UserPage.css';


function UserPage() {
  // AKA the GM screen page.

  const history = useHistory();
  const dispatch = useDispatch();
  const game = useSelector((store) => store.gameReducer);
  const user = useSelector((store) => store.user);


  useEffect(() => {
    dispatch({ type: 'FETCH_GAMES' });
  }, []);

  let [newGame, setGame] = useState({
    name: '',
  });

  const makeNewGame = event => {
    event.preventDefault();
    console.log("in makeNewGame", newGame);
    dispatch({ type: 'MAKE_GAME', payload: newGame });
    setGame({
      name: '',
    });
   dispatch({ type: 'FETCH_GAMES' });
  };


  const loader = (game) => {
   console.log('loader activate', game.id);
    dispatch({ type: 'FETCH_GAME', payload: game.id });
    dispatch({ type: 'GAME_INFO', payload: game.id });
      history.push(`/game/${game.id}`);
};


  const deleter = (game) => {
    //console.log('deleter activate: game id:', {id});
    dispatch({ type: 'DELETE_GAME', payload: game.id})  // put and axio req right here.
    dispatch({ type: 'FETCH_GAMES'});
  };


  return (
    <>    
      <div className="container">
        <h2>Welcome, {user.username}!</h2>
        {/* <p>Your ID is: {user.id}</p> */}
        <p>This is where you load your Labyrinths from!</p>
        {game.length > 0 &&
          <table className='cinereousTable'>
          <thead>
            <tr>
              <th></th><th>Labyrinth Name</th><th>Turn #</th><th></th>
            </tr>
          </thead>
          <tbody>
            {game.map(game => {
              return (
                <tr className='gameList' key={game.id} >
                  <td><button onClick={() => loader(game)}>Load Labyrinth</button></td>
                  <td>{game.name}</td><td>{game.turn}</td>
                  <td><button onClick={() => deleter(game)}>Delete Labyrinth</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      }
      </div>
        <form className="container" onSubmit={makeNewGame} >
        <h2>To make a new Labyrinth all it needs is a name!</h2>

          <input
            value={newGame.name}
            onChange={(e) => setGame({ ...newGame, name: e.target.value })}
            type="text"
            id="name"
            placeholder="Labyrinth Name" />
          {/* <input
            value={newGame.total_tiles}
            onChange={(e) => setGame({ ...newGame, total_tiles: e.target.value })}
            type="number"
            id="tiles"
            placeholder="Set Labyrinth Width(9)" /> */}
          <div className="buttonDiv">
            <button type="submit" value='submit'>Create New Labyrinth</button>
          </div>
        </form>
      </>
  );  
}

export default UserPage;
