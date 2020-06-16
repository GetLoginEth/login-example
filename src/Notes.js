import React, {Fragment, useEffect, useState} from 'react';
import WaitButton from "./Elements/WaitButton";
import {Link} from "react-router-dom";

const getDefaultUri = () => {
    return window.location.href.replace(window.location.hash, '').replace('#', '');
};

const notesAbi = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "text",
                "type": "string"
            }
        ],
        "name": "createNote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newAddress",
                "type": "address"
            }
        ],
        "name": "setGetLoginStorageAddress",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getLoginStorageAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "usernameHash",
                "type": "bytes32"
            }
        ],
        "name": "getNotes",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "usernameHash",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "string",
                        "name": "text",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "isActive",
                        "type": "bool"
                    }
                ],
                "internalType": "struct Notes.Note[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "wallet",
                "type": "address"
            }
        ],
        "name": "getUsername",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "UserNotes",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "usernameHash",
                "type": "bytes32"
            },
            {
                "internalType": "string",
                "name": "text",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
const notesContractAddress = '0x1411eD91e667B91e10055E64A61e1e6FE0525140';
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export default function Notes() {
    const [status, setStatus] = useState('loading');
    const [authorizeUrl, setAuthorizeUrl] = useState(null);
    const [user, setUser] = useState(null);
    const [notes, setNotes] = useState([]);
    const [noteText, setNoteText] = useState('');
    const [error, setError] = useState('');
    const [isWorking, setIsWorking] = useState(false);
    const [isNotesLoading, setIsNotesLoading] = useState(false);

    const appId = 1;
    let appUrl, scriptUrl;
    if (isDev) {
        scriptUrl = "https://localhost:3000/api/last.js";
        appUrl = 'https://localhost:3000/bzz:/getlogin.eth/';
    } else {
        scriptUrl = "https://swarm-gateways.net/bzz:/getlogin.eth/api/last.js";
        appUrl = 'https://swarm-gateways.net/bzz:/getlogin.eth/';
    }

    const setAccessToken = token => {
        localStorage.setItem('access_token', token);
    };

    const getAccessToken = () => {
        return localStorage.getItem('access_token');
    };

    const init = () => {
        window.getLoginApi.setClientAbi(notesAbi);
        window.getLoginApi.setOnLogout(_ => {
            setStatus('authorize');
            setUser(null);
            setAccessToken(null);
            window.location.replace('./');
        });

        const start = async () => {
            const data = await window.getLoginApi.init(appId, appUrl, getDefaultUri(), getAccessToken());
            console.log(data);
            if (!data.result) {
                alert('Error: not initialized');
                return;
            }

            setAuthorizeUrl(data.data.authorize_url);
            if (data.data.is_client_allowed) {
                setStatus('authorized');
                //setAccessToken(data.data.access_token);
                const userInfo = await window.getLoginApi.getUserInfo();
                setUser(userInfo);
                updateNotes(userInfo.usernameHash);
            } else {
                setStatus('authorize');
            }
        };

        start().then();
    };

    useEffect(_ => {
        window._onGetLoginApiLoaded = instance => {
            window.getLoginApi = instance;
            init();
        };
        const urlAccessToken = (new URLSearchParams(window.location.hash.replace('#', ''))).get('access_token');
        if (urlAccessToken) {
            window.location.replace('');
            setAccessToken(urlAccessToken);
        }

        const s = window.document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = scriptUrl;
        window.document.head.appendChild(s);

    }, []);

    const updateNotes = (usernameHash) => {
        setIsNotesLoading(true);
        return window.getLoginApi.callContractMethod(notesContractAddress, 'getNotes', usernameHash)
            .then(data => {
                setNotes(data);
            })
            .catch(e => {
                console.log(e);
                setError(e);
            })
            .then(_ => {
                setIsNotesLoading(false);
            });
    };

    const Spinner = <div className="spinner-border text-success" role="status">
        <span className="sr-only">Loading...</span>
    </div>;

    return <Fragment>
        <header>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link className="navbar-brand" to="./">Notes App Example</Link>
                <button aria-controls="basic-navbar-nav" type="button" aria-label="Toggle navigation"
                        className="navbar-toggler collapsed">
                    <span className="navbar-toggler-icon"/>
                </button>
                <div className="navbar-collapse collapse" id="basic-navbar-nav">
                    {user && user.username && <div className="ml-auto navbar-nav">
                        <a className="nav-link float-right" href="#" onClick={e => {
                            e.preventDefault();
                            window.getLoginApi.logout();
                        }}>Logout ({user.username})</a>
                    </div>}
                </div>
            </nav>
        </header>

        {/*<h1 className="text-center">Notes app example</h1>*/}

        <div className="text-center mt-3">
            {status === 'loading' && Spinner}

            {status === 'authorize' && <a className="btn btn-success" href={authorizeUrl}>Authorize</a>}

            {user && <div>
                {/*status === 'authorized' && <p style={{color: 'green'}}>Application authorized!</p>*/}
                {/*<h4>Hello, {user.username}!</h4>*/}

                {error && error.length > 0 && <p style={{color: 'red'}}>{error}</p>}

                <div className="input-group mb-3">
                    <textarea disabled={isWorking} value={noteText} onChange={e => setNoteText(e.target.value)}
                              className="form-control"
                              placeholder="Text" maxLength={140}/>

                </div>
                <p className="text-muted">{noteText.length} / 140</p>

                <WaitButton disabled={isWorking}>
                    <button disabled={noteText.length === 0} className="btn btn-primary" onClick={_ => {
                        setIsWorking(true);
                        window.getLoginApi.sendTransaction(notesContractAddress, 'createNote', [noteText], {resolveMethod: 'mined'})
                            .then(data => {
                                console.log(data);
                                return updateNotes(user.usernameHash);
                            })
                            .catch(e => {
                                console.log(e);
                                setError(e);
                            })
                            .then(_ => {
                                setNoteText('');
                                setIsWorking(false);
                            });
                    }}>
                        Save note to smart contract
                    </button>
                </WaitButton>

                {notes && notes.length > 0 && <div style={{textAlign: 'left'}}>
                    <h4 className="mt-3">My notes</h4>
                    {notes.map((item, index) => {
                        return <p key={index}>ID: {item.id}<br/>{item.text}</p>
                    })}
                </div>}

                <div className="mt-3">{isNotesLoading && Spinner}</div>

                <div className="text-left">
                    <h4 className="mt-3">App info</h4>
                    <p>Smart contract URL: <a target="_blank"
                                              href={`https://rinkeby.etherscan.io/address/${notesContractAddress}`}>
                        https://rinkeby.etherscan.io/address/{notesContractAddress}
                    </a>
                    </p>
                </div>
            </div>}
        </div>
    </Fragment>;
}
