import React, {useEffect, useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [appId, setAppId] = useState(1);
    const [url, setUrl] = useState('https://localhost:3000/bzz:/getlogin.eth/authorize');
    const [pluginUrl, setPluginUrl] = useState('https://localhost:3000/bzz:/getlogin.eth/xplugin');
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

        if (accessToken || error) {
            window.location.hash = '';
            setRedirectUrl(window.location.href);
        }
    }, []);

    return (
        <div className="container">
            <h1>Authorize app examples</h1>

            <h3 className="mt-5">Redirect auth</h3>
            <form method="get" action={url}>
                <div className="form-group">
                    <label htmlFor="url">URL</label>
                    <input type="text" className="form-control" id="url"
                           placeholder="URL" value={url} onChange={e => setUrl(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label htmlFor="appId">Client ID</label>
                    <input type="text" name="client_id" className="form-control" id="appId"
                           placeholder="Client ID" value={appId} onChange={e => setAppId(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label htmlFor="redirectUrl">Redirect URL</label>
                    <input type="text" name="redirect_url" className="form-control" id="redirectUrl"
                           placeholder="Redirect URL" value={redirectUrl}
                           onChange={e => setRedirectUrl(e.target.value)}/>
                </div>


                <button type="submit" className="btn btn-primary">Authorize with GetLogin</button>
            </form>

            <h3 className="mt-5">Plugin auth</h3>
            <div className="form-group">
                <label htmlFor="url">Plugin URL</label>
                <input type="text" className="form-control" id="plugin-url"
                       placeholder="Plugin URL" value={pluginUrl} onChange={e => setPluginUrl(e.target.value)}/>
            </div>

            <button className="btn btn-primary mr-3" onClick={_ => {
                window.getLoginApi.init(pluginUrl)
                    .then(data => {
                        alert(data);
                    });
            }}>
                Init
            </button>

            <button className="btn btn-primary" onClick={_ => {
                window.getLoginApi.getUserInfo().then(data => alert('test 111 OK ' + JSON.stringify(data))).catch(e => alert(e));
            }}>
                Test
            </button>
        </div>
    );
}

export default App;
