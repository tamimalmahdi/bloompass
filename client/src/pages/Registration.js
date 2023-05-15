import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SHA256 } from "crypto-js";

export default function Registration() {
  const navigate = useNavigate();
  let passwordCombos = [];

  function encrypt(password) {
    return SHA256(password).toString();
  }

  const proximityIndex = {
    a: ["q", "w", "s", "z"],
    b: ["v", "g", "h", "n"],
    c: ["x", "d", "f", "v"],
    d: ["s", "f"],
    e: ["w", "r"],
    f: ["d", "g"],
    g: ["s", "f"],
    h: ["g", "j"],
    i: ["u", "o"],
    j: ["h", "k"],
    k: ["j", "l"],
    l: ["k", "o"],
    m: ["n", "j", "k"],
    n: ["b", "m"],
    o: ["i", "p"],
    p: ["o", "l"],
    q: ["w", "a"],
    r: ["e", "t", "f"],
    s: ["a", "d", "w"],
    t: ["r", "y", "g"],
    u: ["y", "i"],
    v: ["c", "b"],
    w: ["a", "e", "q", "s"],
    x: ["z", "c"],
    y: ["t", "u"],
    z: ["a", "s", "x"],
  };

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .email("Must be a valid email")
      .required("Email is required"),
    password: Yup.string().min(8).max(25).required("Password is required"),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Password confirmation is required"),
  });

  const validateUsername = (username) => {
    console.log(username.replace(/ /g, ""));
    return username.replace(/ /g, "");
  };

  const onSubmit = (data) => {
    let uname = validateUsername(data.username);
    let addInitialPass = { username: uname, password: data.password };

    addUser(addInitialPass);
  };

  const capsLockOnPassword = (password) => {
    let newPassword = password;
    for (var i = 0; i < password.length; i++) {
      let char = password.charAt(i);
      let isLetter = /[a-zA-Z]/.test(char);
      if (isLetter) {
        if (char === char.toUpperCase()) {
          newPassword = replaceChar(newPassword, char.toLowerCase(), i);
        } else if (char === char.toLowerCase()) {
          newPassword = replaceChar(newPassword, char.toUpperCase(), i);
        }
      }
    }
    passwordCombos.push(encrypt(newPassword));
  };

  function addFirstLast(password) {
    passwordCombos.push(encrypt(password.substring(1)));
    passwordCombos.push(encrypt(password.substring(0, password.length - 1)));
  }

  const generatePasswordCombos = (data) => {
    passwordCombos.push(encrypt(data.password)); // add normal password
    capsLockOnPassword(data.password); // add caps locked password
    addFirstLast(data.password); // add without first or last char

    for (var i = 0; i < data.password.length; i++) {
      let char = data.password.charAt(i);
      let isLetter = /[a-zA-Z]/.test(char);
      let newPassword = data.password;
      if (isLetter) {
        proximityIndex[char.toLowerCase()].forEach((typo) => {
          newPassword = replaceChar(newPassword, typo, i);
          console.log(encrypt(newPassword));
          passwordCombos.push(encrypt(newPassword));
          newPassword = replaceChar(newPassword, typo.toUpperCase(), i);
          console.log(encrypt(newPassword));
          passwordCombos.push(encrypt(newPassword));
        });
      }
    }

    addPassword(data.username, passwordCombos);
  };

  async function addUser(data) {
    await axios
      .post("http://localhost:3001/auth/createUser", data)
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          console.log(response);
          generatePasswordCombos(data); // add typo variants
          console.log("Registration Complete");
          navigate("/");
        }
      });
  }

  async function addPassword(username, passwords) {
    let userPasswordCombos = { username: username, passwords: passwords };
    await axios
      .post("http://localhost:3001/auth/addPassword", userPasswordCombos)
      .then((response) => {
        console.log(response);
      });
  }

  function replaceChar(origString, replaceChar, index) {
    let newStringArray = origString.split("");
    newStringArray[index] = replaceChar;
    let newString = newStringArray.join("");
    return newString;
  }

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Email: </label>
          <ErrorMessage name="username" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="username"
            placeholder="me@example.com"
          />
          <label>Password: </label>
          <ErrorMessage name="password" component="span" />
          <Field
            autoComplete="off"
            type="password"
            id="inputCreatePost"
            name="password"
            placeholder="********"
          />
          <label>Confirm password: </label>
          <ErrorMessage name="passwordConfirm" component="span" />
          <Field
            autoComplete="off"
            type="password"
            id="inputCreatePost"
            name="passwordConfirm"
            placeholder="********"
          />

          <button type="submit">Register</button>
        </Form>
      </Formik>
    </div>
  );
}
