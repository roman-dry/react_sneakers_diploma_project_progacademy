import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import styles from './Orders/Orders.module.scss';

function Login({ setUserViewName }) {
	
	const [getLog, setGetLog] = useState('');
	const [getPass, setGetPass] = useState('');
	const [isLoginTrue, setIsLoginTrue] = useState(false);		
	const [isWrongPass, setIsWrongPass] = useState(false);

	useEffect(() => {
		async function getTrueLogin(getLog, getPass) {
			const { data } = await axios.get('https://64440fc9466f7c2b4b60d1da.mockapi.io/items/login');
		console.log(data)
		data.map(obj => {
			if(obj.email === getLog && obj.password === getPass) {

				console.log('OWOWOWOWOWOOWOWOWOW!!!!!!');
				setIsLoginTrue(true);
				setUserViewName(obj.name);
			}
			return obj;
		})

		}

		getTrueLogin(getLog, getPass);

	}, [{getPass}]);

	function getWrongPass() {
		setIsWrongPass(true);

	}

	// async function getData() {
	// 	const { data } = await axios.get('https://64440fc9466f7c2b4b60d1da.mockapi.io/items/login');
	// 	console.log(data)
	// 	data.map(obj => {
	// 		if(obj.email === getLog && obj.password === getPass) {

	// 			console.log('OWOWOWOWOWOOWOWOWOW!!!!!!');
	// 		}
	// 		return obj;
	// 	})

	// }


	// async function getLogin() {

	// 	console.log('GOOOOOD!!!')
	// 	const { data } = await axios.get('https://64440fc9466f7c2b4b60d1da.mockapi.io/items/login');
	//    console.log(data);
		
	// 	try {
	// 		let login = document.getElementById('login').ariaValueText;
	// 		let password = document.getElementById('password').ariaValueText;
	// 		const { data } = await axios.get('https://64440fc9466f7c2b4b60d1da.mockapi.io/items/login');
	// 		console.log(data);

	// 		for(let obj of data) {
	// 			console.log(obj);
	// 			if(obj.email === login && obj.password === password) {
	// 				console.log('GOOd!!')
	// 			}

	// 		}
			
	// 	} catch (error) {
	// 		alert('Wrong login')
			
	// 	}
	// }

	
	return (
		<div>
			<div className='text-center pb-4'>
				<h6 className="mt-4">Login or <Link to="/registration"><span>Registration</span></Link></h6>
				
									
					<div>
						<label  className="mt-3" htmlFor="login">Email</label><br />
						<input type='login' name="login" id="login" placeholder="john@email.com" 
							onChange={(e) => setGetLog(e.target.value)} />
					</div>					
					<div>
						<label  className="mt-3" htmlFor="password">Password</label><br />
						<input type='password' name="password" id="password"
							onChange={(e) => setGetPass(e.target.value)} />
					</div>	
					{
						isLoginTrue ? <Link to="/"><button className={styles.submitBtn}>SUBMIT</button>	</Link> :
						<button onClick={getWrongPass} className={styles.submitBtn}>SUBMIT</button>	
					}
					{
						isWrongPass ? <p style={{color: 'red'}}>Wrong login or password!</p> : ''
					}
					
										
					
				

			</div>
			<button>Get</button>
		</div>
	)
}

export default Login;