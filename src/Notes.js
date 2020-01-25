import React, {Fragment, useEffect, useState} from 'react';

const getDefaultUri = () => {
    return window.location.href.replace(window.location.hash, '').replace('#', '');
};

export default function Notes() {
    const [status, setStatus] = useState('loading');
    const [authorizeUrl, setAuthorizeUrl] = useState(null);
    const [user, setUser] = useState(null);
    const [notes, setNotes] = useState([]);
    const [noteText, setNoteText] = useState('');

    const appId = 1;
    //const appUrl='https://swarm-gateways.net/bzz:/a97c9c4c5ba171afd7a8859d6c317e2d7ff3a42c3d1610686bba6626764957f6/;
    const appUrl = 'https://localhost:3000/bzz:/getlogin.eth/';

    let interval = null;

    const init = () => {
        const start = async () => {
            const data = await window.getLoginApi.init(appId, appUrl, getDefaultUri());
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
            } else {
                setStatus('authorize');
            }
        };

        start().then();
    };

    useEffect(_ => {
        interval = setInterval(_ => {
            if (window.getLoginApi) {
                clearInterval(interval);
                init();
            }
        }, 100);
    }, []);

    return <Fragment>
        <h1 className="text-center">Notes app example</h1>

        <div className="text-center">
            {status === 'loading' &&
            <div className="spinner-border text-success" role="status">
                <span className="sr-only">Loading...</span>
            </div>}

            {status === 'authorize' && <a className="btn btn-success" href={authorizeUrl}>Authorize</a>}

            {user && <div>
                {/*status === 'authorized' && <p style={{color: 'green'}}>Application authorized!</p>*/}
                <h4>Hello, {user.username}!</h4>

                <div className="input-group mb-3">
                    <textarea value={noteText} onChange={e => setNoteText(e.target.value)} className="form-control"
                              placeholder="Text" maxLength={140}/>

                </div>
                <p className="text-muted">{noteText.length} / 140</p>

                <button className="btn btn-primary" onClick={_ => {
                    alert(123);
                }}>
                    Save note to smart contract
                </button>

                {notes && notes.length > 0 && <div>
                    <h4>My notes</h4>
                    {notes.map((item, index) => {
                        return <p key={index}>{item}</p>
                    })}
                </div>}
            </div>}
        </div>
    </Fragment>;
}
