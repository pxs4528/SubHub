/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-console */
/* eslint-disable import/no-duplicates */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './assets/Standard Collection 26.svg';import React from 'react';
import AppBar from './AppBar';
import './Login.module.css';




export default function Signup() {
    console.log(window.ipcRenderer);
  const text = " "
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const Navigate = useNavigate();

  const validate = () => {
    fetch('http://localhost:8080/auth/google/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name, pass }),
    }).then((res) => {
      if (res.status === 201) {
        Navigate('/login'); // navigate to home page after login
      }
    });
  }

// TODO: Add Redirection to home page after registration
// Perhaps, figure whats going on.
  return (
    <div className="flex flex-col h-screen">
      {window.Main && (
        <div className="app-bar">
          <AppBar />
        </div>
      )}

<div className="w-full min-h-screen  bg-gray-50 flex sm:justify-center items-center pt-6 sm:pt-0 ">
  <div className=" border-black bg-white h-400 border-2 border-solid	rounded-xl">
    <div className="p-5">
      <h2 className=" mb-12 text-black text-center text-5xl font-extrabold"><a className='mr-5'>Welcome to</a>  <img className='mb-4 h-8 inline-flex w-xs' src={Icon} alt="Icon of Electron" />  Subhub! </h2>
      {/* <hr className="-mt-12 mb-12 border-t-2 border-gray-300"></hr> */}
      
      <form>
      <div className="mb-8">
          {/* <label className="block mb-1" htmlFor="name">Name</label> */}
          <input onChange={
            (e) => {
              setName(e.target.value);
            }
          } id="name" type="text" name="name" placeholder='Name' className="py-2 px-3 border border-gray-300 focus:border-red-300 focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" />
        </div>
        <div className="mb-8">
          {/* <label className="block mb-1" htmlFor="email">Email Address</label> */}
          <input id="email" type="text" name="email" placeholder='Email' className="py-2 px-3 border border-gray-300 focus:border-red-300 focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" required />
        </div>
        <div className="mb-8">
          {/* <label className="block mb-1" htmlFor="emailC">Confirm Email Address</label> */}
          <input onChange={
            (e) => {
              setEmail(e.target.value);
            }
          } id="emailC" type="text" name="email"placeholder='Confirm Email' className="py-2 px-3 border border-gray-300 focus:border-red-300 focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" required />
        </div>

        <div className="mb-8">
          {/* <label className="block mb-1" htmlFor="password">Password</label> */}
          <input  id="password" type="password" name="password" placeholder='Password' className="py-2 px-3 border border-gray-300 focus:border-red-300 focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" required />
        </div>
        <div className="mb-8">
          {/* <label className="block mb-1" htmlFor="passwordC">Confirm Password</label> */}
          <input onChange={
            (e) => {
              setPass(e.target.value);
            }
          } id="passwordC" type="password" name="password" placeholder='Confirm Password' className="py-2 px-3 border border-gray-300 focus:border-red-300 focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" required />
        </div>
        <div className="mt-6">
          <button
          onClick={
            (e) => {
              e.preventDefault();
              validate();
            }
          }
          className="w-full inline-flex text-white items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold capitalize text-white hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200 disabled:opacity-25 transition">Sign Up</button>
        </div>
        <div className="mt-6 text-center">
        <a href="/login" className="dark:text-white underline">Have an account? Sign in instead!</a>
      </div>
      </form>
    </div>
  </div>
</div>
    </div>
  );
}
