import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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
          { this.renderrow(this.props.sizexo) }
        </div>
      </div>
    );
  }
  
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
      sizexo: 3,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      history: [
        {
          squares: Array(event.target.value*event.target.value).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      sizexo: event.target.value
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares,this.state.sizexo) || squares[i]) {
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

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares,this.state.sizexo);
    
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

      <label>
        Size : 
        <input type="number" value={this.state.sizexo} onChange={this.handleChange} />
      </label>

      <div className="game">
        <div className="game-board">
        <br></br>
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            sizexo={this.state.sizexo}
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

function calculateWinner(squares,sizexo) {

  const lines = [];
  var n = parseInt(sizexo);

  for(let i = 0 ; i<n ; i++){
    const row = [];
    for(let j = i*n ; j < n*(i+1);j++)
    {
      row.push(j);
    }
    lines.push(row);
  }

  for(let i = 0 ; i<n ; i++){
    const row = [];
    for(let j = i ; j <= (n*(n-1))+i ; j+=n){
      row.push(j);
    }
    lines.push(row)
  }

  const temp = [];
  for(let j = 0 ; j < n*n ; j += (n+1) ){
    temp.push(j);
  }
  lines.push(temp);

  const temp1 = [];
  for(let j = n-1 ; j <= n*(n-1) ; j += (n-1) ){
    temp1.push(j);
  }
  lines.push(temp1);


  var count = 0;
  for (let i = 0; i < lines.length; i++) {

    const check = Array.from(lines[i]) ;
    
    for(let j = 0; j < n-1 ; j++){
      if( squares[ check[j] ] && squares[ check[j] ] === squares[ check[j+1] ] ){
        count++;
      }
      if(count == n-1){
        return squares[check[j]] ;
      }
    }
    count = 0;
  }
  return null;
}