/* eslint-disable import/no-duplicates */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
// eslint-disable-next-line import/no-duplicates
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import AppBar from './AppBar';
import Icon from './assets/Screenshot_2023-09-25_005311-transformed.png';
import './index.css';


export default function dashboard() {
  console.log(window.ipcRenderer);

  
  const Navigate = useNavigate();


  return (
    <div className="flex flex-col h-screen">
      {window.Main && (
        <div className="app-bar">
          <AppBar />
        </div>
      )}
      <div className="bg-black text-white flex flex-col flex-grow">
        hi
        </div>



    </div>
  );
}
