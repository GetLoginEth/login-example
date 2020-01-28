import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from "./Main";
import Notes from "./Notes";

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

function App() {
    return (
        <Router>
            <div className="container">
                <Switch>
                    <Route exact path="/:swarm_protocol?/:swarm_hash?/">
                        <Notes/>
                    </Route>

                    <Route path="/:swarm_protocol?/:swarm_hash?/openid">
                        <Main/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
