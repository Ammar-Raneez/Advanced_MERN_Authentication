import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route exact path="/login" component={loginScreen} />
          <Route exact path="/register" component={registerScreen} />
          <Route exact path="/forgotPassword" component={forgotPasswordScreen} />
          <Route exact path="/passwordReset/:resetToken" component={passwordResetScreen} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

// proxy added to package.json to any routing done in axios
// will be automatically passed ot that proxy value, if the url is not
// explicitly specified