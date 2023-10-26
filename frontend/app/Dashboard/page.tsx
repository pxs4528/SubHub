"use client";
import { useState } from "react";
import React from "react";
import Icon from "@/public/assets/subhub_logo.svg";
import "./dashboard.css";

export default function dashboard() {
  function DropdownMenu() {
    console.log("hi");
  }

  function TopSearchFunction(e: React.FormEvent<HTMLInputElement>) {
    let input = (e.target as HTMLInputElement).value;
    console.log(input);
  }

  function FilterTable(e: React.FormEvent<HTMLInputElement>) {
    let input = (e.target as HTMLInputElement).value;
    console.log(input);
  }

  function SideBarClose() {
    document.getElementById("overlap-8")!.style.opacity = "0";

    document.getElementById("NavOpen")!.style.opacity = "100";
  }

  function SideBarOpen() {
    document.getElementById("overlap-8")!.style.opacity = "100";
    document.getElementById("NavOpen")!.style.opacity = "0";
  }

  return (
    <div className="index">
      <div className="div">
        <div className="overlap">
          <div className="earning">
            <div className="overlap-group">
              <img
                className="rectangle"
                alt="Rectangle"
                src="https://cdn.animaapp.com/projects/652caec9cd622539e3544593/releases/652caf6c8e0f2ac1913234dd/img/rectangle-15.svg"
              />
              <div className="group">
                <div className="group-2">
                  <div className="text-wrapper">Outgoing</div>
                  <div className="text-wrapper-2">$198</div>
                  <div className="money-recive-wrapper">
                    <img
                      className="img"
                      alt="Money recive"
                      src="https://cdn.animaapp.com/projects/652caec9cd622539e3544593/releases/652caf6c8e0f2ac1913234dd/img/money-recive-1.svg"
                    />
                  </div>
                  <div className="group-3">
                    <p className="element-this-month">
                      <span className="span">37.8%</span>
                      <span className="text-wrapper-3"> this month</span>
                    </p>
                    <img
                      className="arrow-up"
                      alt="Arrow up"
                      src="https://cdn.animaapp.com/projects/652caec9cd622539e3544593/releases/652caf6c8e0f2ac1913234dd/img/arrow-up-1.svg"
                    />
                  </div>
                </div>
                <div className="group-4">
                  <div className="text-wrapper">Previous Month</div>
                  <div className="wallet-money-wrapper">
                    <img
                      className="img"
                      alt="Wallet money"
                      src="https://cdn.animaapp.com/projects/652caec9cd622539e3544593/releases/652caf6c8e0f2ac1913234dd/img/wallet-money-1.svg"
                    />
                  </div>
                </div>
                <img
                  className="line"
                  alt="Line"
                  src="https://cdn.animaapp.com/projects/652caec9cd622539e3544593/releases/652caf6c8e0f2ac1913234dd/img/line-2.svg"
                />
              </div>
              <div className="overview">
                <div className="overlap-2">
                  <div className="overlap-group-wrapper">
                    <div className="overlap-group-2">
                      <img
                        className="chevron-down"
                        alt="Chevron down"
                        src="https://cdn.animaapp.com/projects/652caec9cd622539e3544593/releases/652caf6c8e0f2ac1913234dd/img/chevron-down-1.svg"
                      />
                      <div className="text-wrapper-4">Quarterly</div>
                    </div>
                  </div>
                  <div className="text-wrapper-5">Overview</div>
                  <div className="text-wrapper-6">Monthly Spending</div>
                  <div className="text-wrapper-7">Jan</div>
                  <div className="text-wrapper-8">Feb</div>
                  <div className="text-wrapper-9">Mar</div>
                  <div className="text-wrapper-10">Apr</div>
                  <div className="text-wrapper-11">May</div>
                  <div className="text-wrapper-12">Jun</div>
                  <div className="text-wrapper-13">Jul</div>
                  <div className="text-wrapper-14">Aug</div>
                  <div className="text-wrapper-15">Sep</div>
                  <div className="text-wrapper-16">Oct</div>
                  <div className="text-wrapper-17">Nov</div>
                  <div className="text-wrapper-18">Dec</div>
                  <div className="rectangle-2" />
                  <div className="rectangle-3" />
                  <div className="rectangle-4" />
                  <div className="rectangle-5" />
                  <div className="rectangle-6" />
                  <div className="rectangle-7" />
                  <div className="rectangle-8" />
                  <div className="rectangle-9" />
                  <div className="rectangle-10" />
                  <div className="rectangle-11" />
                  <div className="rectangle-12" />
                  <div className="rectangle-13" />
                  <div className="group-wrapper">
                    <div className="group-5">
                      <div className="text-wrapper-19">35%</div>
                      <div className="vector-wrapper">
                        <img
                          className="vector"
                          alt="Vector"
                          src="https://cdn.animaapp.com/projects/652caec9cd622539e3544593/releases/652caf6c8e0f2ac1913234dd/img/vector-1.svg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="customers">
            <div className="overlap-3">
              <div className="text-wrapper-5">Spendings</div>
              <div className="overlap-group-3">
                <div className="ellipse" />
                <img
                  className="ellipse-2"
                  alt="Ellipse"
                  src="https://cdn.animaapp.com/projects/652caec9cd622539e3544593/releases/652caf6c8e0f2ac1913234dd/img/ellipse-6.svg"
                />
                <img
                  className="ellipse-3"
                  alt="Ellipse"
                  src="https://cdn.animaapp.com/projects/652caec9cd622539e3544593/releases/652caf6c8e0f2ac1913234dd/img/ellipse-7.svg"
                />
                <p className="element-streaming">
                  <span className="text-wrapper-20">
                    65%
                    <br />
                  </span>
                  <span className="text-wrapper-21">Streaming Services</span>
                </p>
              </div>
            </div>
          </div>
          <div className="text-wrapper-22">$123</div>
        </div>
        <div className="product">
          <div className="overlap-4">
            <div className="text-wrapper-23">Subscriptions</div>
            <div className="group-6">
              <div className="text-wrapper-24">9/10/2023</div>
              <div className="text-wrapper-25">$ 45.99</div>
              <div className="text-wrapper-26">60</div>
              <div className="group-7">
                <div className="text-wrapper-27">Netflix</div>
                <p className="p">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <img
                  className="img-2"
                  alt="Unsplash eo"
                  src="https://cdn.animaapp.com/projects/652caec9cd622539e3544593/releases/652caf6c8e0f2ac1913234dd/img/unsplash-wh2fhl0v-eo.svg"
                />
              </div>
            </div>
            <div className="group-8">
              <div className="text-wrapper-27">NordVPN</div>
              <div className="text-wrapper-24">9/10/2023</div>
              <div className="text-wrapper-25">$ 45.99</div>
              <div className="text-wrapper-26">3</div>
              <p className="p">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <img
                className="img-2"
                alt="Unsplash namzag"
                src="https://cdn.animaapp.com/projects/652caec9cd622539e3544593/releases/652caf6c8e0f2ac1913234dd/img/unsplash-a2j--namzag.svg"
              />
            </div>
            <div className="group-9">
              <div className="text-wrapper-27">Amazon Prime</div>
              <div className="text-wrapper-24">9/10/2023</div>
              <div className="text-wrapper-25">$ 45.99</div>
              <div className="text-wrapper-26">7</div>
              <p className="p">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <img
                className="img-2"
                alt="Unsplash RAZU"
                src="https://cdn.animaapp.com/projects/652caec9cd622539e3544593/releases/652caf6c8e0f2ac1913234dd/img/unsplash-razu-r66vuc.svg"
              />
            </div>
            <div className="group-10">
              <div className="text-wrapper-27">Google One</div>
              <div className="text-wrapper-24">9/10/2023</div>
              <div className="text-wrapper-25">$ 45.99</div>
              <div className="text-wrapper-26">1</div>
              <p className="p">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <img
                className="img-2"
                alt="Unsplash cpccybprf a"
                src="https://cdn.animaapp.com/projects/652caec9cd622539e3544593/releases/652caf6c8e0f2ac1913234dd/img/unsplash-cpccybprf-a.svg"
              />
            </div>
            <div className="group-11">
              <div className="group-12">
                <div className="text-wrapper-28">Product Name</div>
                <div className="text-wrapper-29">Date</div>
                <div className="text-wrapper-30">Price</div>
                <div className="text-wrapper-31">Total duration</div>
              </div>
              <img
                className="line-2"
                alt="Line"
                src="https://cdn.animaapp.com/projects/652caec9cd622539e3544593/releases/652caf6c8e0f2ac1913234dd/img/line-4.svg"
              />
            </div>
            <div className="div-wrapper">
              <div className="overlap-group-4">
                <div className="overlap-6">
                  <input
                    className="input"
                    placeholder="Search"
                    onInput={(e) => FilterTable(e)}
                    type="text"
                  />
                  <img
                    className="search"
                    alt="Search"
                    src="https://cdn.animaapp.com/projects/652caec9cd622539e3544593/releases/652caf6c8e0f2ac1913234dd/img/search-1.svg"
                  />
                </div>
                <img
                  className="search"
                  alt="Search"
                  src="https://cdn.animaapp.com/projects/652caec9cd622539e3544593/releases/652caf6c8e0f2ac1913234dd/img/search-1.svg"
                />
              </div>
            </div>
            <div className="overlap-wrapper">
              <div className="overlap-5">
                <button onClick={(e) => DropdownMenu()}>
                  <img
                    className="chevron-down-2"
                    alt="Chevron down"
                    src="https://cdn.animaapp.com/projects/652caec9cd622539e3544593/releases/652caf6c8e0f2ac1913234dd/img/chevron-down-1.svg"
                  />
                </button>
                <div className="text-wrapper-33">Last 30 days</div>
              </div>
            </div>
          </div>
        </div>
        <div className="search-2">
          <div className="overlap-6">
            <input
              className="input1"
              placeholder="Search"
              type="text"
              onInput={(e) => TopSearchFunction(e)}
            />
            <img
              className="search"
              alt="Search"
              src="https://cdn.animaapp.com/projects/652caec9cd622539e3544593/releases/652caf6c8e0f2ac1913234dd/img/search-1.svg"
            />
          </div>
        </div>

        <div className="overlap-7">
          <div className="side-menu">
            <button onClick={(e) => SideBarOpen()}>
              <img
                className="NavOpen"
                id="NavOpen"
                alt="Setting"
                src="./assets/menu-symbol-of-three-parallel-lines-svgrepo-com.svg"
              />
            </button>
            <div className="overlap-8" id="overlap-8">
              <div className="list-menu-wrapper">
                <div className="list-menu">
                  <img
                    className="img-3"
                    alt="Icon outline key"
                    src="https://cdn.animaapp.com/projects/652caec9cd622539e3544593/releases/652caf6c8e0f2ac1913234dd/img/icon---24---outline---key-square.svg"
                  />
                  <div className="text-wrapper-34">Dashboard</div>
                  <img
                    className="chevron-right"
                    alt="Chevron right"
                    src="https://cdn.animaapp.com/projects/652caec9cd622539e3544593/releases/652caf6c8e0f2ac1913234dd/img/chevron-right-2.svg"
                  ></img>
                </div>
              </div>
              <div className="list-menu-2">
                <img
                  className="img-3"
                  alt="Element square"
                  src="https://cdn.animaapp.com/projects/652caec9cd622539e3544593/releases/652caf6c8e0f2ac1913234dd/img/3d-square-1.svg"
                />
                <div className="text-wrapper-35">Manage Subscriptions</div>
                <img
                  className="chevron-right"
                  alt="Chevron right"
                  src="https://cdn.animaapp.com/projects/652caec9cd622539e3544593/releases/652caf6c8e0f2ac1913234dd/img/chevron-right-2.svg"
                />
              </div>
              <div className="list-menu-3">
                <img
                  className="img-3"
                  alt="User square"
                  src="https://cdn.animaapp.com/projects/652caec9cd622539e3544593/releases/652caf6c8e0f2ac1913234dd/img/user-square-1.svg"
                />
                <div className="text-wrapper-36">About</div>
                <img
                  className="chevron-right"
                  alt="Chevron right"
                  src="https://cdn.animaapp.com/projects/652caec9cd622539e3544593/releases/652caf6c8e0f2ac1913234dd/img/chevron-right-2.svg"
                />
              </div>
              <div className="group-13">
                <div className="overlap-group-5">
                  <div className="text-wrapper-37">Parth</div>
                  <div className="text-wrapper-38">Guy</div>
                </div>
              </div>
              <img
                className="chevron-down-3"
                alt="Chevron down"
                src="https://cdn.animaapp.com/projects/652caec9cd622539e3544593/releases/652caf6c8e0f2ac1913234dd/img/chevron-down-2.svg"
              />
              <div className="group-14">
                <div className="text-wrapper-39">GSM</div>
                <button onClick={(e) => SideBarClose()}>
                  <img
                    className="setting"
                    alt="Setting"
                    src="./assets/menu-symbol-of-three-parallel-lines-svgrepo-com.svg"
                  />
                </button>
              </div>
              <div className="text-wrapper-40">v.01</div>
            </div>
          </div>
          <img
            className="image"
            alt="Image"
            src="https://cdn.animaapp.com/projects/652caec9cd622539e3544593/releases/652caf6c8e0f2ac1913234dd/img/image-1.png"
          />
        </div>
        <div className="text-wrapper-41">Hello Parth 👋🏼,</div>
      </div>
    </div>
  );
}
