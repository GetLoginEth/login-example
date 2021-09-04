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
const notesContractAddress = '0xf6b270136Da7F8a2113B93a3b9Eeaf5160C45bA0';
// const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export default function Notes() {
    const [authorizeUrl, setAuthorizeUrl] = useState(null);
    const [user, setUser] = useState(null);
    const [notes, setNotes] = useState([]);
    const [noteText, setNoteText] = useState('');
    const [error, setError] = useState('');
    const [isWorking, setIsWorking] = useState(false);
    const [isNotesLoading, setIsNotesLoading] = useState(false);

    const [GLStatus, setGLStatus] = useState('loading');
    const [GLInstance, setGLInstance] = useState(null);

    const REWARD_APP_ID = 3;
    const GL_BASE_URL = 'https://getlogin.org/';
    const RETURN_URL = 'https://testeron.pro/gl-notes';
    // const GL_BASE_URL = 'https://getlogin.localhost:3000/';

    const setAccessToken = token => {
        localStorage.setItem('access_token', token);
    };

    const getAccessToken = () => {
        return localStorage.getItem('access_token');
    };

    const onLogout = () => {
        console.log('Logged out');
        setAccessToken('');
        setGLStatus('not_logged');
        setUser(null);
    };

    const updateNotes = (usernameHash, instance = null) => {
        setIsNotesLoading(true);
        return (instance ? instance : GLInstance).callContractMethod(notesContractAddress, 'getNotes', usernameHash)
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

    useEffect(() => {
        function checkAccessToken() {
            const urlAccessToken = (new URLSearchParams(window.location.hash.replace('#', ''))).get('access_token');
            if (urlAccessToken) {
                window.location.replace('');
                setAccessToken(urlAccessToken);
            }
        }

        function injectGetLogin() {
            const script = document.createElement('script');
            script.src = `${GL_BASE_URL}api/last.js?${Math.random()}`;
            script.async = true;
            script.type = 'module';
            script.onload = async () => {
                const instance = new window._getLoginApi();
                instance.onLogout = onLogout;
                setGLInstance(instance);
                setGLStatus('auth_checking');
                const result = await instance.init(REWARD_APP_ID, GL_BASE_URL, RETURN_URL, getAccessToken());
                console.log('result', result);
                if (result.data.is_client_allowed) {
                    setGLStatus('logged');
                    const userInfo = await instance.getUserInfo();
                    setUser(userInfo);
                    instance.setClientAbi(notesAbi);
                    updateNotes(userInfo.usernameHash, instance);
                } else {
                    setGLStatus('not_logged');
                }

                setAuthorizeUrl(instance.getAuthorizeUrl());
            };

            document.body.appendChild(script);
        }

        checkAccessToken();
        injectGetLogin();
    }, []);

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
                            if (window.confirm('Logout?')) {
                                GLInstance.logout();
                            }
                        }}>Logout ({user.username})</a>
                    </div>}
                </div>
            </nav>
        </header>

        <div className="text-center mt-3">
            {(GLStatus === 'loading' || GLStatus === 'auth_checking') && Spinner}

            {GLStatus === 'not_logged' && <a className="btn btn-success" href={authorizeUrl}>Authorize</a>}

            {GLStatus === 'logged' && <div>
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
                        GLInstance.sendTransaction(notesContractAddress, 'createNote', [noteText], {resolveMethod: 'mined'})
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
                    {[...notes].reverse().map((item, index) => {
                        return <p key={index}>ID: {item.id}<br/>{item.text}</p>
                    })}
                </div>}

                <div className="mt-3">{isNotesLoading && Spinner}</div>

                <div className="text-left">
                    <h4 className="mt-3">App info</h4>
                    <p>Smart contract URL: <a target="_blank"
                                              href={`https://blockscout.com/xdai/mainnet/address/${notesContractAddress}`}>
                        https://blockscout.com/xdai/mainnet/address/{notesContractAddress}
                    </a>
                    </p>
                </div>
            </div>}
        </div>
    </Fragment>;
}
