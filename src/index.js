import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { useState } from "react";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
      />
    );
  }

  rendercolumn(n,st){
    const column = []

    for(var i = st*n ; i < n*(1+st) ; i++){
      column.push(this.renderSquare(i)) 
    }

    return(
      column
    );

  }

  renderrow(n) {
    const row = []

    for(var i = 0 ; i < n ; i++){
      row.push( <div className="board-row"> {this.rendercolumn(n,i) }</div> )
    }

    return(
      row
    );
  }

  render() {
    return(
      <div>
        <div>
          { this.renderrow(4) }
        </div>
      </div>
    );
  }
  
}

function MyForm() {
  const [n, setName] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`n*n ${n}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Enter your name:
        <input 
          type="number" 
          value={n}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <input type="submit" />
    </form>
  )
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      sizexo: 3
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  handleChange(event) {
    this.setState({
      sizexo: event.target.value
    });
  }

  handleSubmit(event) {
    this.setState({
      sizexo: event.target.value
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to Game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div>

      <form onSubmit={this.handleSubmit}>
        <label>
          Name: {this.state.sizexo} 
          <input type="number" onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>  
        
      <div className="game">
        <div className="game-board">
        <br></br>
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            sizexo={current.sizexo}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}