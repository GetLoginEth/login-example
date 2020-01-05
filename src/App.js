import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from "./Main";
import Notes from "./Notes";

function App() {
    const content = window.location.hash === '#test' ? <Main/> : <Notes/>;
    return (
        <div className="container">
            {content}
        </div>
    );
}

export default App;
