import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { NotificationManager, NotificationContainer} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { fetchWrap } from '../../services/fetchWrap'
import Input from '../../components/input'
import Erreur from '../../components/erreur'

class SignIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      login: '',
      password: '',
      firstname: '',
      lastname: '',
      email: '',
      isSignedIn: false,
      error: {},
      status: false
    }

    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this) 
    this.handleChange = this.handleChange.bind(this)    
  }

  handleFormSubmit(e) {
    var error = {}
    if (this.state.login.length === 0)
      error.login = ["Login field can't be empty"]
    if (this.state.password.length === 0)
      error.password = ["Password field can't be empty"]
    if (this.state.firstname.length === 0)
      error.firstname = ["Firstname field can't be empty"]
    if (this.state.lastname.length === 0)
      error.lastname = ["Lastname field can't be empty"]
    if (this.state.email.length === 0)
      error.email = ["Email field can't be empty"]
    e.preventDefault();
    if ((Object.keys(this.state.error).length === 0 && Object.keys(error).length === 0) || this.state.status) {
      fetchWrap('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          login: this.state.login,
          first_name: this.state.firstname,
          last_name: this.state.lastname,
          email: this.state.email,
          password: this.state.password
        })
      })
      .then(() => {
        NotificationManager.success("Sign up successfull, now let's stream!!", 'Signed Up!', 5000, () => {});
        this.setState({
          isSignedIn: true
        })
      })
      .catch(error => {
        if (error)
            this.setState({ error, status: true })
      })
    }
    else if (Object.keys(this.state.error).length === 0 || this.state.status) {
      this.setState({ error })
    }
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });
  }

  handleInputChange = (state, value) => {
    this.setState({
      [state]: value
    })
  }

  handleError = (error) => {
    var tmp;
    if (typeof error === "string")
    {
      tmp = this.state.error
      delete tmp[error]
    }
    else if (this.state.status === true)
      tmp = Object.assign({}, error)
    else
      tmp = Object.assign({}, this.state.error, error)
    this.setState({
      error: tmp, status: false
    })
  }
      
  render() {
    if (this.state.isSignedIn) {
      return <Redirect to="/login" />
    }
    //console.log(this.state.error)
    return (
      <div>
      <form className="inscription" onSubmit={this.handleFormSubmit}>
        <Input type="text" name="login" placeholder="Login" required error={this.handleError} validation={[6]} onChange={this.handleInputChange} /><br />
        <Input type="text" name="firstname" placeholder="Firstname" required onChange={this.handleInputChange} error={this.handleError} validation={[2]} forbiddenChars={['[0-9]']} /><br />
        <Input type="text" name="lastname" placeholder="Lastname" required onChange={this.handleInputChange} error={this.handleError} validation={[2]} forbiddenChars={['[0-9]']} /><br />
        <Input type="text" name="email" placeholder="Email" required onChange={this.handleInputChange} error={this.handleError} validation={[6,'^.+@.+\\..+$']} forbiddenChars={["[^a-zà-ÿ0-9-_@.]", "gi"]} /><br />
        <Input type="password" name="password" placeholder="Password" required onChange={this.handleInputChange} error={this.handleError} validation={[6,"[0-9]","[a-zA-Z]"]} /><br />
        <button type="submit">Sign Up</button>
      </form>
      <Erreur error={this.state.error} />
      <NotificationContainer/>
      </div>
    )
  }
}

export default SignIn