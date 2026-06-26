import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api/authService';
import { useAuth } from '../context/AuthContext';
import axios from "axios";
import userOutlineIcon from '../assets/userOutlineIcon.png';
import userFillIcon from '../assets/userFillIcon.png';
import passwordIcon from '../assets/passwordIcon.png';

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }
  return fallback;
};


const Login = () => {
  const [active, setActive] = useState('login');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({ email: '', password: '' });

  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [signupErrors, setSignupErrors] = useState({ name: '', email: '', password: '' });

  const validateLogin = () => {
    const errors = { email: '', password: '' };
    let valid = true;

    if (!loginData.email) {
      errors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      errors.email = 'Enter a valid email';
      valid = false;
    }

    if (!loginData.password) {
      errors.password = 'Password is required';
      valid = false;
    } else if (loginData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setLoginErrors(errors);
    return valid;
  };

  const validateSignup = () => {
    const errors = { name: '', email: '', password: '' };
    let valid = true;

    if (!signupData.name) {
      errors.name = 'Name is required';
      valid = false;
    }

    if (!signupData.email) {
      errors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      errors.email = 'Enter a valid email';
      valid = false;
    }

    if (!signupData.password) {
      errors.password = 'Password is required';
      valid = false;
    } else if (signupData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setSignupErrors(errors);
    return valid;
  };

  const handleLogin = async () => {
  if (!validateLogin()) return;

  try {
    setLoading(true);
    setServerError('');
    const data = await loginUser({
      email: loginData.email.trim(),
      password: loginData.password,
    });
    login(data.user, data.token);
    navigate('/');
  } catch (err) {
    setServerError(getErrorMessage(err, 'Login failed. Please try again.'));
  } finally {
    setLoading(false);
  }
};

const handleSignup = async () => {
  if (!validateSignup()) return;

  try {
    setLoading(true);
    setServerError('');
    await registerUser({
      name: signupData.name.trim(),
      email: signupData.email.trim(),
      password: signupData.password,
    });
    setShowModal(true);
  } catch (err) {
    setServerError(getErrorMessage(err, 'Signup failed. Please try again.'));
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center w-full h-screen bg-white">

      <button onClick={() => navigate('/')} className="md:hidden absolute top-4 left-4 z-10 text-gray-300 hover:text-purple-600 font-medium flex items-center gap-1">
        ← Home
      </button>

      {/* SUCCESS MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl px-10 py-10 flex flex-col items-center gap-4 w-80">
            {/* Checkmark */}
            <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-purple-400 flex items-center justify-center">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Account Created!</h2>
            <p className="text-sm text-gray-500 text-center">Your account has been successfully created. You can now log in.</p>
            <button
              onClick={() => { setShowModal(false); setActive('login'); }}
              className="bg-purple-400 text-white font-semibold px-8 py-2.5 rounded-full hover:bg-purple-500 transition-colors w-full"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}

      <div className='h-full md:h-10/12 flex items-center md:w-9/12 w-full'>
        <div className="bg-purple-200 mx-auto container h-full rounded-lg flex flex-col md:flex-row shadow-gray-300 shadow-[0px_0px_35px_15px]">
        <div className="h-5/12 md:h-full md:w-4/12 md:rounded-l-lg bg-purple-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-purple-800 md:[clip-path:polygon(0_0,25vw_0,0_41vh)] [clip-path:polygon(0_0,100vw_0,0_22vh)]"></div>
          <div className="absolute inset-0 bg-purple-500 md:[clip-path:polygon(0_100vh,0_41vh,35vw_100vh)] [clip-path:polygon(0vw_22vh,100vw_41.5vh,100vw_42vh,0vw_100vh)]"></div>

          <div className="absolute right-0 top-10 flex flex-col items-end gap-6 z-10">
            <div className="flex flex-col gap-4 items-end justify-center pt-30">

              {/* LOGIN TAB */}
              <div className="hidden md:block relative cursor-pointer" onClick={() => { setActive('login'); setServerError(''); }}>
                {active === 'login' && (
                  <div className="absolute -top-8 right-0 w-8 h-8 bg-purple-300 rounded-br-[999px] shadow-[8px_8px_0_8px_white]"/>
                )}
                <div className={`text-sm relative z-20 font-bold tracking-wide pl-6 pr-5 py-3 rounded-l-full
                  ${active === 'login' ? 'bg-white text-gray-800' : 'bg-transparent text-white'}`}>
                  LOGIN
                </div>
                {active === 'login' && (
                  <div className="absolute -bottom-8 right-0 w-8 h-8 bg-purple-300 rounded-tr-[999px] shadow-[8px_-8px_0_8px_white]"/>
                )}
              </div>

              {/* SIGN UP TAB */}
              <div className="hidden md:block relative cursor-pointer" onClick={() => { setActive('signup'); setServerError(''); }}>
                {active === 'signup' && (
                  <div className="absolute -top-8 right-0 w-8 h-8 bg-purple-300 rounded-br-[999px] shadow-[8px_8px_0_8px_white]"/>
                )}
                <div className={`text-sm relative z-20 font-bold tracking-wide pl-5 pr-4 py-3 rounded-l-full
                  ${active === 'signup' ? 'bg-white text-gray-800' : 'bg-transparent text-white'}`}>
                  SIGN UP
                </div>
                {active === 'signup' && (
                  <div className="absolute -bottom-8 right-0 w-8 h-8 bg-purple-300 rounded-tr-[999px] shadow-[8px_-8px_0_8px_white]"/>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="md:w-8/12 h-7/12 md:h-full mx-auto container rounded-r-lg bg-[#FFFFFF]">
            
            <div className="flex mx-22 h-11 md:hidden justify-center relative -top-11 cursor-pointer">
                <div onClick={() => { setActive('login'); setServerError(''); }} className={`text-sm relative z-20 font-bold tracking-wide px-2 py-2 mt-2
                  ${active === 'login' ? 'bg-white text-gray-800' : 'bg-transparent text-white'}`}>
                  LOGIN
                </div>
                <div onClick={() => { setActive('signup'); setServerError(''); }} className={`text-sm relative z-20 font-bold tracking-wide px-2 py-2 mt-2
                  ${active === 'signup' ? 'bg-white text-gray-800' : 'bg-transparent text-white'}`}>
                  SIGN UP
                </div>
              </div>

          {/* LOGIN PAGE */}
          {active === 'login' && (
            <div className='mx-auto container'>
              <div className='hidden md:flex flex-col items-center gap-3 pt-15'>
                <div className="w-20 h-20 rounded-full bg-purple-300 flex flex-col justify-center items-center shadow-gray-300 shadow-[0px_0px_9px_1px]">
                  <img className='w-16 h-16' src={userOutlineIcon} alt="User"/>
                </div>
                <h1 className='font-bold text-2xl'>LOGIN</h1>
              </div>

              <div className='flex flex-col gap-2 md:pt-6'>

                {serverError && (
                  <p className="text-red-500 text-sm w-10/12 mx-auto text-center font-medium">{serverError}</p>
                )}

                {/* Email */}
                <div className='flex flex-col items-center'>
                  <div className='flex items-center justify-center relative w-full'>
                    <div className="absolute lg:left-20 left-10 w-5 h-5 border rounded-full bg-gray-600 flex flex-col justify-center items-center">
                      <img src={userFillIcon} alt="userfill" />
                    </div>
                    <input
                      className='md:pl-15 pl-12 font-bold rounded-b-xl border-b-2 border-gray-500 outline-none w-10/12 py-3.5 placeholder:text-md placeholder:font-semibold'
                      placeholder='Email'
                      type="text"
                      value={loginData.email}
                      onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                    />
                  </div>
                  {loginErrors.email && <p className="text-red-500 text-xs w-10/12 mt-1">{loginErrors.email}</p>}
                </div>

                {/* Password */}
                <div className='flex flex-col items-center'>
                  <div className='flex items-center justify-center relative w-full'>
                    <div className="absolute lg:left-20 left-10 w-5 h-5 border rounded-full bg-gray-600 flex flex-col justify-center items-center">
                      <img src={passwordIcon} alt="userfill" />
                    </div>
                    <input
                      className='md:pl-15 pl-12 font-bold rounded-b-xl border-b-2 border-gray-500 outline-none w-10/12 py-3.5 placeholder:text-md placeholder:font-semibold'
                      placeholder='Password'
                      type="password"
                      value={loginData.password}
                      onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                    />
                  </div>
                  {loginErrors.password && <p className="text-red-500 text-xs w-10/12 mt-1">{loginErrors.password}</p>}
                </div>

                <div className='w-10/12 flex justify-end'>
                  <span onClick={() => navigate('/forgot-password')}
                    className="text-purple-700 text-sm font-medium cursor-pointer hover:underline">
                    Forgot Password?
                  </span>
                </div>

                <div className='w-10/12 flex justify-end pt-4'>
                  <button
                    onClick={handleLogin}
                    disabled={loading}
                    className='bg-purple-300 px-8 py-2.5 font-semibold rounded-full disabled:opacity-60'
                  >
                    {loading ? 'Logging in...' : 'LOGIN'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SIGN UP PAGE */}
          {active === 'signup' && (
            <div className="h-full mx-auto container flex flex-col overflow-hidden">
              <div className='hidden md:flex flex-col items-center gap-2 pt-8'>
                <div className="w-20 h-20 rounded-full bg-purple-300 flex flex-col justify-center items-center shadow-gray-300 shadow-[0px_0px_9px_1px]">
                  <img className='w-16 h-16' src={userOutlineIcon} alt="User"/>
                </div>
                <h1 className='font-bold text-2xl'>SIGN UP</h1>
              </div>

              <div className='flex flex-col gap-1 md:pt-3'>

                {serverError && (
                  <p className="text-red-500 text-sm w-10/12 mx-auto text-center font-medium">{serverError}</p>
                )}

                {/* Name */}
                <div className='flex flex-col items-center'>
                  <div className='flex items-center justify-center relative w-full'>
                    <div className="absolute lg:left-20 left-10 w-5 h-5 border rounded-full bg-gray-600 flex flex-col justify-center items-center">
                      <img src={userFillIcon} alt="userfill" />
                    </div>
                    <input
                      className='md:pl-15 pl-12 font-bold rounded-b-xl border-b-2 border-gray-500 outline-none w-10/12 py-3.5 placeholder:text-md placeholder:font-semibold'
                      placeholder='Name'
                      type="text"
                      value={signupData.name}
                      onChange={e => setSignupData({ ...signupData, name: e.target.value })}
                    />
                  </div>
                  {signupErrors.name && <p className="text-red-500 text-xs w-10/12 mt-1">{signupErrors.name}</p>}
                </div>

                {/* Email */}
                <div className='flex flex-col items-center'>
                  <div className='flex items-center justify-center relative w-full'>
                    <div className="absolute lg:left-20 left-10 w-5 h-5 border rounded-full bg-gray-600 flex flex-col justify-center items-center">
                      <img src={userFillIcon} alt="userfill" />
                    </div>
                    <input
                      className='md:pl-15 pl-12 font-bold rounded-b-xl border-b-2 border-gray-500 outline-none w-10/12 py-3.5 placeholder:text-md placeholder:font-semibold'
                      placeholder='Email'
                      type="email"
                      value={signupData.email}
                      onChange={e => setSignupData({ ...signupData, email: e.target.value })}
                    />
                  </div>
                  {signupErrors.email && <p className="text-red-500 text-xs w-10/12 mt-1">{signupErrors.email}</p>}
                </div>

                {/* Password */}
                <div className='flex flex-col items-center'>
                  <div className='flex items-center justify-center relative w-full'>
                    <div className="absolute lg:left-20 left-10 w-5 h-5 border rounded-full bg-gray-600 flex flex-col justify-center items-center">
                      <img src={passwordIcon} alt="userfill" />
                    </div>
                    <input
                      className='md:pl-15 pl-12 font-bold rounded-b-xl border-b-2 border-gray-500 outline-none w-10/12 py-3.5 placeholder:text-md placeholder:font-semibold'
                      placeholder='Password'
                      type="password"
                      value={signupData.password}
                      onChange={e => setSignupData({ ...signupData, password: e.target.value })}
                    />
                  </div>
                  {signupErrors.password && <p className="text-red-500 text-xs w-10/12 mt-1">{signupErrors.password}</p>}
                </div>

                <div className='w-10/12 flex justify-end pt-7'>
                  <button
                    onClick={handleSignup}
                    disabled={loading}
                    className='bg-purple-300 px-8 py-2.5 font-semibold rounded-full disabled:opacity-60'
                  >
                    {loading ? 'Signing up...' : 'SIGN UP'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;