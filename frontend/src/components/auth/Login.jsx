import './Login.css'

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, signInWithFacebook, signInWithGoogle } from './auth'
import { useState } from 'react'
import Footer from '../landing_page/footer/Footer'
import Spacing from '../landing_page/spacing/Spacing'
import googleIcon from '../landing_page/images_icons/Google Icon.png'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false);
    const [googleErrorMessage, setGoogleErrorMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            await signInWithEmailAndPassword(email, password)
            navigate('/profile')
        }
        catch (err) {
            const errorMessage = err.message;
            const errorCode = err.code;

            setError(true);
            console.log(errorCode)

            switch (errorCode) {
                case "auth/invalid-email":
                    setErrorMessage("This email address is invalid.");
                    break;
                case "auth/user-disabled":
                    setErrorMessage(
                        "This email address is disabled by the administrator."
                    );
                    break;
                case "auth/user-not-found":
                    setErrorMessage("This email address is not registered.");
                    break;
                case "auth/wrong-password":
                    setErrorMessage("The password is invalid or the user does not have a password.")
                    break;
                default:
                    setErrorMessage(errorMessage);
                    break;
            }
        }
    }


    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle()
            navigate('/profile')

        }
        catch (err) {
            const errorMessage = err.message;
            const errorCode = err.code;

            setError(true);

            switch (errorCode) {
                case "auth/operation-not-allowed":
                    setGoogleErrorMessage("Email/password accounts are not enabled.");
                    break;
                case "auth/operation-not-supported-in-this-environment":
                    setGoogleErrorMessage("HTTP protocol is not supported. Please use HTTPS.")
                    break;
                case "auth/popup-blocked":
                    setGoogleErrorMessage("Popup has been blocked by the browser. Please allow popups for this website.")
                    break;
                case "auth/popup-closed-by-user":
                    setGoogleErrorMessage("Popup has been closed by the user before finalizing the operation. Please try again.")
                    break;
                default:
                    setGoogleErrorMessage(errorMessage);
                    break;
            }
        }
    }

    const handleFacebookLogin = async () => {
        try {
            await signInWithFacebook()
            navigate('/profile')

        }
        catch (error) {
            console.error('Error during signin with Facebook:', error)
        }
    }

    const handleCreateAccount = () => {
        navigate('/signup')
    }

    const handleHome = ()=>{
        navigate('/')
    }

    

    return (
        <>
            <nav className='navBar-container'>
                <div className="navbar">
                    <div className="brand">
                        InterviewMe
                    </div>
                    <ul className="nav-links">
                        <li><a type='button' onClick={handleHome} >Home</a></li>
                        
                    </ul>
                </div>
            </nav>
            <Spacing/>
            <div className='form-container'>
                <div className='login-form'>
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <button type='submit' className='login-button'>Login</button>
                    </form>
                    {error && <p className='error-message'>{errorMessage}</p>}
                    {/* TODO: finish up meta developers authentication. Must file business authentication. (takes minimum 5 days) */}
                    {/* <button onClick={handleFacebookLogin}>Login with Facebook</button> */}
                    <button className="google-button" onClick={handleGoogleLogin}><i className="fa-brands fa-google"></i>Login with Google</button>
                    {error && <p>{googleErrorMessage}</p>}
                    <p className='form-footer'>Don't have an account? </p>
                    <button onClick={handleCreateAccount} className='signup-button'>Signup</button>
                </div>
            </div>
            <Spacing/>
            <Footer/>
        </>


    )


}

export default Login