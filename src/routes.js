import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Main from './pages/Main/Main';
import CallBack from './pages/CallBack/CallBack';
import Dashboard from './pages/Dashboard/Dashboard';

export default function Routes(){
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component = {Main}/>
                <Route path="/callback" exact component = {CallBack}/>
                <Route path="/dashboard" exact component = {Dashboard}/>
            </Switch>
        </BrowserRouter>
    )
}