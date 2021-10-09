import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from './components/routing/PrivateRoute';
import PrivateScreen from './components/screens/PrivateScreen';
import LoginScreen from './components/screens/LoginScreen';
import RegisterScreen from './components/screens/RegisterScreen';
import ForgotPasswordScreen from './components/screens/ForgotPasswordScreen';
import PasswordResetScreen from './components/screens/PasswordResetScreen';

function App() {
  return (
    <Router>
      <div className="app">
        <Switch>
          <PrivateRoute exact path='/' component={PrivateScreen} />
          <Route exact path="/login" component={LoginScreen} />
          <Route exact path="/register" component={RegisterScreen} />
          <Route exact path="/forgotPassword" component={ForgotPasswordScreen} />
          <Route exact path="/passwordReset/:resetToken" component={PasswordResetScreen} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

// proxy added to package.json to any routing done in axios
// will be automatically passed ot that proxy value, if the url is not
// explicitly specified