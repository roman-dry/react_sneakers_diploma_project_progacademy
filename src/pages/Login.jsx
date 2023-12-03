import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { jwtDecode } from "jwt-decode";
import { setTokenItem } from "../redux/slices/tokenSlice";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";

import styles from './Orders/Orders.module.scss';

function Login({ setCardCart, setFavorites, url }) {	
			
	const [isWrongPass, setIsWrongPass] = useState("");
	const { register, handleSubmit } = useForm();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	async function onSubmit(obj) {
		try {
			const response = await axios.post(`${url}api/auth/authenticate`,
                JSON.stringify(obj),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            const accessToken = response?.data?.access_token;
            const data = response.data;
            const role = response?.data?.role;
            dispatch(
                setTokenItem({
                  userId: data.userId,
                  access_token: accessToken,
                  exp: jwtDecode(accessToken).exp,
                })
            );
            const responseUser = await axios.get(`${url}user/${data.userId}`, {
                headers: { Authorization: `Bearer ${data.access_token}` },
              });
			const dataUser = responseUser.data;
			dispatch(setUser(dataUser));
			setIsWrongPass("");

			if (role === 'ADMIN') {
				return navigate('/admin')
			} else if (role === 'USER') {
				const cartResponse = await axios.get(`${url}cart?user_id=${data.userId}`, {
					headers: { Authorization: `Bearer ${data.access_token}` },
				  });
				const favoriteResponse = await axios.get(`${url}favorite?user_id=${data.userId}`, {
					headers: { Authorization: `Bearer ${data.access_token}` },
				  });
				setCardCart(cartResponse.data);
				setFavorites(favoriteResponse.data);
				navigate('/');
			}
			
		} catch (err) {
			if (!err?.response) {
                setIsWrongPass('No Server Response');
            } else if (err.response?.status === 400) {
                setIsWrongPass('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setIsWrongPass('Unauthorized');
            } else {
                setIsWrongPass('Login Failed');
            }
			
		}
		
	}
		
	return (
		<div>
			<div className='text-center pb-4'>
				<h6 className="mt-4">Login or <Link to="/registration"><span>Registration</span></Link></h6>

					<form className="mt-3" onSubmit={handleSubmit(onSubmit)}>					
						<input {...register('email', { required: true })} className="mt-3" name="email" placeholder="Email" /><br />
						<input {...register('password', { required: true })} className="mt-3" name="password" type="password" placeholder="Password" /><br />
						<button type="submit" className={styles.submitBtn}>Submit</button> 
					</form>
				<span style={{color: 'red'}}>{isWrongPass}</span>
			</div>
		</div>
	)
}

export default Login;