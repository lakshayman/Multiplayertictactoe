import React from 'react';
import { Storage } from './../../storage/storage.js';
import { Box } from './../board-box/board-box';
import * as utils from '../../utils/functions.js';
import io from 'socket.io-client';
import queryString from 'query-string';
import TextContainer from '../Text Container/TextContainer';
import './board.css'
import '../board-box/box.css'
import '../buttons.css'
export class Board extends React.Component{
    constructor(props) {
        super(props)
        let socket;
        let winner = null;
        this.state = {
            users: [],
            name: '',
            room: '',
            boxes: Array(9).fill(null),
            history: [],
            choice: 'X',
            isMyTurn: false,
            opponent: null,
            isGameEnded: false
        }
    }

    

    setName = (nname) => {
        this.setState({
            name: nname
        })
    }
    setRoom = (nroom) => {
        this.setState({
            room: nroom
        })
    }

    componentDidMount(){
        const ENDPOINT = 'https://intense-fjord-58803.herokuapp.com/'
        var connectionOptions =  {
            "force new connection" : true,
            "reconnectionAttempts": "Infinity", 
            "timeout" : 10000,                  
            "transports" : ["websocket"]
          };
          const { name, room } = queryString.parse(this.props.location.search);
      
          this.socket = io.connect(ENDPOINT, connectionOptions);
      
          this.setRoom(room);
          this.setName(name)
      
          this.socket.emit('join', { name, room }, (error) => {
            if(error) {
              window.location.href = "/";
              alert(error);
            }
          });

          this.socket.on('opponent', ({ opponent, isMyTurn, choice }) => {
              this.setState({
                  opponent: opponent,
                  isMyTurn: isMyTurn,
                  choice: choice
              })
          });

          this.socket.on('turn', ({boxes, history}) => {
              this.setState({
                  boxes: boxes,
                  history: history,
                  isMyTurn: !this.state.isMyTurn
              })
          });

          this.socket.on('winner', () => {
              this.winner = this.state.name;
          });

          this.socket.on("roomData", ({ users }) => {
            this.setState({
                users: users
            })
          });

    };

    storage = new Storage()

    handleBoxClick(index){
        const boxes = this.state.boxes.slice()
        let history = this.state.history

        if(!this.state.isMyTurn){
            return
        }

        if(utils.findWinner(boxes) || boxes[index]){
            return
        }
        if(utils.areAllBoxesClicked(boxes) === true){
            return
        }
        boxes[index] = this.state.choice
        history.push(this.state.choice)
        this.socket.emit('turn',({boxes: boxes, history: history, id: this.state.opponent.id}));
        this.setState({
            boxes: boxes,
            history: history,
            isMyTurn: !this.state.isMyTurn
        })
    }
    handleBoardRestart = () => {
        this.setState({
            boxes: Array(9).fill(null),
            history: [],
            xIsNext: true
        })
    }
    render(){
        this.winner = utils.findWinner(this.state.boxes, this.state.choice, this.state.name, this.state.opponent ? this.state.opponent.name : '')
        const isFilled = utils.areAllBoxesClicked(this.state.boxes)
        console.log([this.winner, isFilled])
        let status
        if(!this.state.opponent){
            status = 'Waiting For Opponent ...'
        }
        else if(this.winner){
            status = `The Winner is ${this.winner}`
            this.storage.update([`${this.winner} won`])
        }else if(!this.winner && isFilled){
            status = 'Game Drawn'
            this.storage.update(['Game Drawn'])
        }else{
            status = `It is ${this.state.isMyTurn ? this.state.name : this.state.opponent.name}'s turn.`
        }
        return(
            <>
                <a href="/Multiplayertictactoe">Go back to scoreboard</a>
                <div className="board-wrapper">
                <div className="board">
                        <h2 className="board-heading">{status}</h2>

                        <div className="board-row">
                            <Box value={this.state.boxes[0]} onClick={() => this.handleBoxClick(0)} />
                            <Box value={this.state.boxes[1]} onClick={() => this.handleBoxClick(1)} />
                            <Box value={this.state.boxes[2]} onClick={() => this.handleBoxClick(2)} />
                        </div>

                        <div className="board-row">
                            <Box value={this.state.boxes[3]} onClick={() => this.handleBoxClick(3)} />
                            <Box value={this.state.boxes[4]} onClick={() => this.handleBoxClick(4)} />
                            <Box value={this.state.boxes[5]} onClick={() => this.handleBoxClick(5)} />
                        </div>

                        <div className="board-row">
                            <Box value={this.state.boxes[6]} onClick={() => this.handleBoxClick(6)} />
                            <Box value={this.state.boxes[7]} onClick={() => this.handleBoxClick(7)} />
                            <Box value={this.state.boxes[8]} onClick={() => this.handleBoxClick(8)} />
                        </div>
                    </div>

                    <div className="board-history">
                        <h2 className="board-heading">Moves history:</h2>
                        <ul className="board-historyList">
                            {this.state.history.length === 0 && <span>No moves to show.</span>}

                            {this.state.history.length !== 0 && this.state.history.map((move, index) => {
                                return <li key={index}>Move {index + 1}: <strong>{move}</strong></li>
                            })}
                        </ul>
                    </div>
                </div>
                <TextContainer users={this.state.users}/>
            </>
        )
    }
}