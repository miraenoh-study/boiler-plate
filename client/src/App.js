import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import LandingPage from './components/pages/LandingPage/LandingPage'
import LoginPage from './components/pages/LoginPage/LoginPage'
import RegisterPage from './components/pages/RegisterPage/RegisterPage'

function App() {
	return (
		<Router>
			<div>
				<Switch>
					<Route exact path="/" component={LandingPage} />
					<Route exact path="/login" component={LoginPage} />
					<Route exact path="/register" component={RegisterPage} />
				</Switch>
			</div>
		</Router>
	)
}

export default App
