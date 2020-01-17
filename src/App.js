import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from "./Main";
import Notes from "./Notes";

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

function App() {
    //const content = window.location.hash === '#test' ? <Main/> : <Notes/>;
    return (
        <Router>
            <div className="container">
                <Switch>
                    <Route exact path="/">
                        <Notes/>
                    </Route>

                    <Route path="/openid">
                        <Main/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
