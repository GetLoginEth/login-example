import React, {useEffect, useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [appId, setAppId] = useState(1);
    const [url, setUrl] = useState('https://localhost:3000/bzz:/getlogin.eth/authorize');
    const [redirectUrl, setRedirectUrl] = useState(window.location.href);

    useEffect(_ => {
        const params = new URLSearchParams(window.location.hash.replace('#', '?'));
        const accessToken = params.get('access_token');
        const error = params.get('error');
        const userId = params.get('user_id');
        if (accessToken) {
            alert('User authorized! Username hash: ' + userId + ', access_token: ' + accessToken);
        } else if (error) {
            alert('Error: ' + error);
        }
    }, []);

    return (
        <div className="container">
            <h1>Authorize app example</h1>

            <form method="get" action={url}>
                <div className="form-group">
                    <label htmlFor="url">URL</label>
                    <input type="text" className="form-control" id="url"
                           placeholder="App ID" value={url} onChange={e => setUrl(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label htmlFor="appId">Client ID</label>
                    <input type="text" name="client_id" className="form-control" id="appId"
                           placeholder="App ID" value={appId} onChange={e => setAppId(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label htmlFor="redirectUrl">Redirect URL</label>
                    <input type="text" name="redirect_url" className="form-control" id="redirectUrl"
                           placeholder="Redirect URL" value={redirectUrl}
                           onChange={e => setRedirectUrl(e.target.value)}/>
                </div>


                <button type="submit" className="btn btn-primary">Authorize with GetLogin</button>
            </form>

        </div>
    );
}

export default App;
