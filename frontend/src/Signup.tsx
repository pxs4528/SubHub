/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-console */
/* eslint-disable import/no-duplicates */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import AppBar from './AppBar';
import './Login.module.css';




export default function Signup() {
    console.log(window.ipcRenderer);

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const Navigate = useNavigate();

  const validate = () => {
    console.log("email", email, pass);
    fetch('http://localhost:8080/api/login', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, pass }),
    }).then((res) => {
      if (res.status === 200) {
        Navigate('/login');
      }
    });
  }



  return (
    <div className="flex flex-col h-screen">
      {window.Main && (
        <div className="app-bar">
          <AppBar />
        </div>
      )}

<div className="w-full min-h-screen bg-gray-50 flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
  <div className="w-full sm:max-w-md p-5 mx-auto">
    <h2 className="mb-12 text-center text-4xl font-extrabold">Welcome to SubHub!</h2>
    <form>
    <div className="mb-4">
        <label className="block mb-1" htmlFor="name">Enter Name</label>
        <input onChange={
          (e) => {
            setName(e.target.value);
          }
        } id="name" type="text" name="name" className="py-2 px-3 border border-gray-300 focus:border-red-300 focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" />
      </div>
      <div className="mb-4">
        <label className="block mb-1" htmlFor="email">Enter Email Address</label>
        <input id="email" type="text" name="email" className="py-2 px-3 border border-gray-300 focus:border-red-300 focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" />
      </div>
      <div className="mb-4">
        <label className="block mb-1" htmlFor="emailC">Confirm Email Address</label>
        <input onChange={
          (e) => {
            setEmail(e.target.value);
          }
        } id="emailC" type="text" name="email" className="py-2 px-3 border border-gray-300 focus:border-red-300 focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" />
      </div>

      <div className="mb-4">
        <label className="block mb-1" htmlFor="password">Enter Password</label>
        <input  id="password" type="password" name="password" className="py-2 px-3 border border-gray-300 focus:border-red-300 focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" />
      </div>
      <div className="mb-4">
        <label className="block mb-1" htmlFor="passwordC">Confirm Password</label>
        <input onChange={
          (e) => {
            setPass(e.target.value);
          }
        } id="passwordC" type="password" name="password" className="py-2 px-3 border border-gray-300 focus:border-red-300 focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full" />
      </div>
      <div className="mt-6">
        <button
        onClick={
          (e) => {
            e.preventDefault();
            validate();
          }
        }
        className="w-full inline-flex items-center justify-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold capitalize text-white hover:bg-red-700 active:bg-red-700 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200 disabled:opacity-25 transition">Sign Up</button>
      </div>
    </form>
  </div>
</div>
    </div>
  );
}
