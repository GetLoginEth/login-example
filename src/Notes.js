import React, {Fragment, useEffect, useState} from 'react';

const getDefaultUri = () => {
    return window.location.href.replace(window.location.hash, '').replace('#', '');
};

export default function Notes() {
    const [status, setStatus] = useState('loading');
    const [authorizeUrl, setAuthorizeUrl] = useState(null);

    let interval = null;

    const init = () => {
        //window.getLoginApi.init(2, 'https://swarm-gateways.net/bzz:/a97c9c4c5ba171afd7a8859d6c317e2d7ff3a42c3d1610686bba6626764957f6/', window.location.href)
        window.getLoginApi.init(2, 'https://localhost:3000/bzz:/getlogin.eth/', getDefaultUri())
            .then(data => {
                console.log(data);
                if (!data.result) {
                    alert('Error: not initialized');
                    return;
                }

                //alert('Is allowed: ' + data.data.is_client_allowed + '. Auth url: ' + data.data.authorize_url);
                setAuthorizeUrl(data.data.authorize_url);
                if (data.data.is_client_allowed) {
                    setStatus('authorized');
                } else {
                    setStatus('authorize');
                }
            });
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
        <h3 className="text-center">Notes app example</h3>

        <div className="text-center">
            {status === 'loading' &&
            <div className="spinner-border text-success" role="status">
                <span className="sr-only">Loading...</span>
            </div>}

            {status === 'authorize' && <a className="btn btn-success" href={authorizeUrl}>Authorize</a>}

            {status === 'authorized' && <div>Application authorized!</div>}
        </div>
    </Fragment>;
}
