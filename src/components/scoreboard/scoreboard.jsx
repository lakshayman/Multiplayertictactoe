import React from 'react';
import { Link } from 'react-router-dom';
import { Storage } from './../../storage/storage';
import '../board/board.css'
import '../board-box/box.css'
import '../buttons.css'
export class Scoreboard extends React.Component{
    state = {
        scoreboard: [],
        name: '',
        room: ''
    }
    async componentDidMount(){
        let storage = await new Storage().getData()
        this.setState({
            scoreboard: storage
        })
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
    render(){
        return (
            <div className='joinOuterContainer'>
                <div className="joinInnerContainer">
                    <h1 className="heading">Tic-Tac-Toe</h1>
                    <div>
                    <input placeholder="Name" className="joinInput" type="text" onChange={(event) => this.setName(event.target.value)} />
                    </div>
                    <div>
                    <input placeholder="Room" className="joinInput mt-20" type="text" onChange={(event) => this.setRoom(event.target.value)} />
                    </div>
                    <Link onClick={e => (!this.state.name || !this.state.room) ? e.preventDefault() : null} to={`/board?name=${this.state.name}&room=${this.state.room}`}>
                    <button className={'button mt-20'} type="submit">Start Game</button>
                    </Link>
                </div>
                <div className='joinInnerContainer'>
                    <h1 className="heading">Recent Games:</h1>
                    <ul>
                        {this.state.scoreboard.map((leader,key) => {
                            return <li className="score" key={key}>{leader}</li>
                        })}
                    </ul>
                </div>
            </div>
            
        )
    }
}