import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator"
import FileBase from 'react-file-base64';


// component
import FormGroup from "../common/FormGroup";
import ButtonSpinner from "../common/ButtonSpinner"

// helper
// refactor to log in after signing up
// refactor to handle loading after signing up
import { signup, login } from '../../services/auth.service'
import { resMessage } from '../../utilities/functions.utilities'

// Function given to react-validator
const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

// function that validates usernames
const vusername = (value) => {
    if(value.length < 3 || value.length >= 20) {
        return (
            <div className="alert alert-danger" role="alert">
                The username must be between 3 and 20 characters.
            </div>
        )
    }
}

// function that validates passwords 
const vpassword = (value) => {
    if(value.length < 6 || value.length >= 40) {
        return (
            <div className="alert alert-danger" role="alert">
                The password must be between 6 and 40 characters.
            </div>
        )
    }
}

// function that validates email (using validator to see if it's in the right format) 
const validEmail = (value) => {
    if(!isEmail(value)) {
        return (
            <div className="alert alert-danger" role="alert">
                The email must be valid.
            </div>
        )
    }
}


const SignUp = (props) => {
  const form = useRef();
  const checkBtn = useRef();

  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  const [data, setData] = useState({
    username: "", 
    password: "", 
    email: "",
    city: "",
    profilePic: ""
  })
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  // // Stores the username in our username state
  // const onChangeUsername = (e) => {
  //   const username = e.target.value;
  //   setUsername(username);
  // };

  // // Stores the email in our email state
  // const onChangeEmail = (e) => {
  //   const email = e.target.value;
  //   setEmail(email);
  // };

  // // Stores the password in our password state
  // const onChangePassword = (e) => {
  //   const password = e.target.value;
  //   setPassword(password);
  // };

  // // Stores the first name in our first name state
  // const onChangeFirstName = (e) => {
  //   const firstName = e.target.value;
  //   setFirstName(firstName);
  // };

  // // Stores the last name in our last name state
  // const onChangeLastName = (e) => {
  //   const lastName = e.target.value;
  //   setLastName(lastName);
  // };

  // // Stores the city in our city state
  // const onChangeCity = (e) => {
  //   const city = e.target.value;
  //   setCity(city);
  // };


  const handleSignUp = (e) => {
    e.preventDefault();
    //Prevent message clear them out
    setMessage("")
    setSuccessful(false)

    // Validates all the fields
    form.current.validateAll();

    // Validator stores errors and we can check if error exist
    if(checkBtn.current.context._errors.length === 0){
      // register the user
      signup(data).then(            
        (response) => {
              setMessage(response.data.message)
              setSuccessful(true)
              // log them in after sign up
              login(data.username, data.password).then(()=> {
                props.history.push("/home")
                window.location.reload()
              })
            },
            (error) => {
              setMessage(resMessage(error))
              setSuccessful(false)
            }
        )
    } else {
      setSuccessful(false)
    }
  };

  const onChangeHandler = (e) => {
    setData({...data,[e.target.name]:e.target.value})
  }
  
  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <Form onSubmit={handleSignUp} ref={form}>
          
          {/* <FormGroup text="First Name">
            <Input
              type="text"
              className="form-control"
              name="firstName"
              value={firstName}
              onChange={onChangeFirstName}
              validations={[required]}
            />
          </FormGroup>

          <FormGroup text="Last Name">
            <Input
              type="text"
              className="form-control"
              name="lastName"
              value={lastName}
              onChange={onChangeLastName}
              validations={[required]}
            />
          </FormGroup> */}

          <FormGroup text="username">
            <Input
              type="text"
              className="form-control"
              name="username"
              value={data.username}
              onChange={onChangeHandler}
              validations={[required, vusername]}
            />
          </FormGroup>

          <FormGroup text="email">
            <Input
              type="text"
              className="form-control"
              name="email"              
              value={data.email}
              onChange={onChangeHandler}
              validations={[required, validEmail]}
            />
          </FormGroup>
        
          <FormGroup text="password">
            <Input
              type="password"
              className="form-control"
              name="password"
              value={data.password}
              onChange={onChangeHandler}
              validations={[required, vpassword]}
            />
          </FormGroup>

          <FormGroup text="city">
            <Input
              type="text"
              className="form-control"
              name="city"
              value={data.city}
              onChange={onChangeHandler}
            />
          </FormGroup>

          <div>
            <FileBase 
              type="file" 
              multiple={false} 
              onDone={({ base64 }) => setData({ ...data, profilePic: base64 })} />
          </div>


          <ButtonSpinner text="Sign Up"/>

          {message && (
            <div className="form-group">
              <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
                {message}
              </div>
            </div>
          )}

          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  );
};

export default SignUp;