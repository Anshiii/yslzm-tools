import React, { useReducer } from 'react';
import logo from './logo.svg';
import './App.css';
import Shop from './components/Shop';
import Statistics from './components/Statistics';
import Result from './components/Result';
import { simpleUpdateState } from './util';

const initialState = {
  //shop
  sixSet: [],
  fiveSet: [],
  colorCard: [],
  makeup: [],
  chat: [],

  //statistics
  currentSave: 0,
  level: '',
  strategy: '',


  // calculate
  // shopTotal: 1000,
  // currentToken: 500,
  // levelInSunday: 1,
  // arenaStrategy: 1,
}



function App() {
  // REDUCER 
  const [state, dispatch] = useReducer(simpleUpdateState, initialState);

  return (
    <div className="App">
      <h2>当前竞技场周期 03/20 ~ 08/13 </h2>
      <Shop state={state} dispatch={dispatch} ></Shop>
      <Statistics state={state} dispatch={dispatch}></Statistics>
      <Result state={state} dispatch={dispatch} ></Result>
    </div>
  );
}

export default App;
