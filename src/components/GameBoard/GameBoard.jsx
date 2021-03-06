import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Boss from './the_boss.png';
import Player from './blue_shield.png';
import upKey from './upKey.png';
import downKey from './downKey.png';
import rightKey from './rightKey.png';
import leftKey from './leftKey.png';
import './GameBoard.css';
import { shiftRow, shiftColumn, calculateNewPosition } from '../../utils/labyrinth.js';


function GameBoard() {


    const params = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const game = useSelector((store) => store.gameReducer);
    // const user = useSelector((store) => store.user);
    const info = useSelector((store) => store.gameInfoReducer);


    useEffect(() => { // onchange rerender.
        setGrid([...game]);
        // setData([info]);  // tried [...info], [info], [{info}], { info }, info
        console.log('in 2nd gb useState', info);  // it makes it here as [{...}], when the second SET_INFO was in.
        // dispatch({ type: 'GAME_INFO', payload: params.id });
    }, [game]);  // maybe I need info here.

    let [grid, setGrid] = useState([...game]);
    let [partyPos, setPartyPos] = useState(info.party_pos);  // data type?
    let [bossPos, setBossPos] = useState(info.boss_pos);  // data type?



    useEffect(() => { // inital state set
        dispatch({ type: "FETCH_GAME", payload: params.id });
        dispatch({ type: 'GAME_INFO', payload: params.id });
        // dispatch({ type: "SET_INFO", payload: params.id, });  // tried payload: params.id, payload: action.payload, payload: game.data
        console.log('in init uS gb', info); 
    }, []);  // loop if anything here.


    // new randomizer + refactor
    // still might want to add tile reorienter, but maybe not now...
    function randomizer(grid) {
        const gridSize = grid.length;
        let newGrid = grid;
        const rows = Math.ceil(Math.sqrt(gridSize));
        const rowIndex = Math.floor((Math.random() * rows) + 0);
        const rowDirection = Math.random() > 0.5 ? 'left' : 'right';
        console.log('moving row', rowIndex, 'in', rowDirection);
        newGrid = shiftRow(newGrid, rowIndex, rowDirection);
        // newGrid = shiftRow(newGrid, 6, 'left');

        // random column
        const columnIndex = Math.floor((Math.random() * rows) + 0);
        const columnDirection = Math.random() > 0.5 ? 'up' : 'down';
        console.log('moving column', columnIndex, 'in', columnDirection);
        newGrid = shiftColumn(newGrid, columnIndex, columnDirection);
        console.log(newGrid);
        setGrid([...newGrid]);
        dispatch({ type: 'MOVE_MAZE', payload: [...newGrid] })
        // increase the turnCount and dispatch it.
        dispatch({ type: "ADD_TURN", payload: params.id });
    }; // end randomizer


    // // Player movement function  1) call tokenMove, 2) PUT new _pos 3) signal next turn phase?
    // // need to target a token!
    const playerMove = (grid, direction) => {  //    const playerMove = (grid, partyPos, direction) => {
        let gameId = 0;
        console.log(info.party_pos);
        let partyPos = info.party_pos;
        console.log('in player move', partyPos); 
        const gridSize = grid.length;
        let newPartyPos = partyPos;
        console.log(direction);
        newPartyPos = calculateNewPosition(partyPos, direction, gridSize)
        setPartyPos(newPartyPos);
        console.log(info.id);
        gameId = info.id;
        console.log(gameId);
        console.log(newPartyPos);
        dispatch({ type: 'MOVE_PARTY', payload: {partyPos: newPartyPos, id: gameId }})
        // dispatch({ type: 'GAME_INFO', payload: params.id });
    } // end playerMove


    // Boss movement function 1) call tokenMove, 2) PUT new _pos 3) signal next turn phase?
    const bossMove = (grid, direction) => {
        let gameId = 0;
        console.log(info.boss_pos);
        let bossPos = info.boss_pos;
        console.log('in boss move', bossPos);
        const gridSize = grid.length;
        let newBossPos = bossPos;
        console.log(direction);
        newBossPos = calculateNewPosition(bossPos, direction, gridSize)
        setBossPos(newBossPos);
        console.log(info.id);
        gameId = info.id;
        console.log(gameId);
        console.log(newBossPos);
        dispatch({ type: 'MOVE_BOSS', payload: {bossPos: newBossPos, id: gameId }});
        console.log(params.id);
        // dispatch({ type: 'GAME_INFO', payload: params.id });
    }


    return (
        <>
            <div className="button-container">
                <button onClick={() => history.push(`/user`)}>Exit the Labyrinth</button>
                <div>
                <h1>{info.name}</h1>
                <h1>Turn #: {info.turn}</h1>
                </div>
                <div className="playerBox" >
                    <img className="token" src={Player} alt="blue shield" />
                    <div className='arrowKeys'>
                        <button onClick={() => playerMove(grid, 'left')}><img className="arrow" src={leftKey} /></button>
                        <button onClick={() => playerMove(grid, 'up')}><img className="arrow" src={upKey} /></button>
                        <button onClick={() => playerMove(grid, 'right')}><img className="arrow" src={rightKey} /></button>
                        <button onClick={() => playerMove(grid, 'down')}><img className="arrow" src={downKey} /></button>
                    </div>
                </div>
                <div className="bossBox">
                    <img className="token" src={Boss} alt="red skull" />
                    <div className='arrowKeys'>
                        <button onClick={() => bossMove(grid, 'left')}> <img className="arrow" src={leftKey}/> </button>
                        <button onClick={() => bossMove(grid, 'up')}><img className="arrow" src={upKey} /></button>
                        <button onClick={() => bossMove(grid, 'right')}><img className="arrow" src={rightKey} /></button>
                        <button onClick={() => bossMove(grid, 'down')}><img className="arrow" src={downKey} /></button>
                    </div>
                </div>
                <button onClick={() => randomizer(grid)}>Move Maze</button>
            </div>

            <div className='gameBox'>
                {game.length > 0 &&
                    <div className="grid-container">
                        {grid.map(tile => {
                            return (
                                <div key={tile.id} className="game-tile">
                                    <p className="tileTitle">{tile.id}</p>
                                    <img className={tile.tile_orientation} src={tile.shape_url} />
                                    { /* NOTE: If both are 'undefined' itll match. Maybe not possible, but noted */}
                                    { tile.tile_pos === info.party_pos && <img className="token" id="player" src={Player} />}
                                    { tile.tile_pos === info.boss_pos && <img className="token" id="boss" src={Boss} />}
                                </div>
                            );
                        })}
                    </div>
                }
            </div>
        </>
    )
};


export default GameBoard;