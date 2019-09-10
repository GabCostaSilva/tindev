// eslint-disable-next-line
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import io from 'socket.io-client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import api from '../services/api'

import logo from '../assets/logo.svg'
import like from '../assets/like.svg'
import dislike from '../assets/dislike.svg'
import itsamatch from '../assets/itsamatch.png'
import loading from '../assets/loading.png'

import './Main.css'

export default function Main({ match }) {
    const [users, setUsers] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [matchDev, setMatchDev] = useState(false)

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: {
                    user: match.params.id,
                }
            })
            setUsers(response.data)
            setLoading(false)
        }
        loadUsers()
    }, [match.params.id])


    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: { user: match.params.id }
        })

        socket.on('match', dev => {
            setMatchDev(dev)
        })
    }, [match.params.id])

    async function handleLike(id) {
        await api.post(`/devs/${id}/like`, null, {
            headers: { user: match.params.id }
        })
        setUsers(users.filter(user => user._id !== id))
    }

    async function handleDislike(id) {
        await api.post(`/devs/${id}/dislike`, null, {
            headers: { user: match.params.id }
        })

        setUsers(users.filter(user => user._id !== id))
    }

    return (
        <div className="main-container">
            <Link to="/">
                <img src={logo} alt="tindev logo" />
            </Link>
            {(isLoading &&
                <div>
                    <FontAwesomeIcon className="spinner" icon={faSpinner} />
                </div>
            )}
            {users.length > 0 ? (
                <ul>
                    {users.map(user => (
                        <li key={user._id}>
                            <img src={user.avatar} alt="profile" />
                            <footer>
                                <strong>{user.name}</strong>
                                <p>{user.bio}</p>
                            </footer>
                            <div className="buttons">
                                <button type="button" onClick={() => handleLike(user._id)}>
                                    <img src={like} alt="Like" />
                                </button>
                                <button type="button" onClick={() => handleDislike(user._id)}>
                                    <img src={dislike} alt="Dislike" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) :
                <div className="empty">Não há mais devs.</div>
            }

            {matchDev && (
                <div className="match-container">
                    <img src={itsamatch} alt="It's a match!" />
                    <img className="avatar" src={matchDev.avatar} alt="" />
                    <strong>{matchDev.name}</strong>
                    <p>{matchDev.bio}</p>

                    <button type="button" onClick={() => setMatchDev(null)}>Fechar</button>
                </div>
            )}
        </div>
    )
}