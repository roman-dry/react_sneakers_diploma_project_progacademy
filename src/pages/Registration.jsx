import React from 'react';

import styles from './Orders/Orders.module.scss';

function Registration() {
	return (
		<div className='text-center pb-4'>
			<h4 className="mt-4">Registration</h4>
			<form className="mt-3" action="https://64440fc9466f7c2b4b60d1da.mockapi.io/items/login" method="post">
				<div>
					<label htmlFor="name">Name</label><br />
					<input name="name" id="name" placeholder="John" />
				</div>
				<div>
					<label  className="mt-3" htmlFor="email">Email</label><br />
					<input type='email' name="email" id="email" placeholder="john@email.com" />
				</div>
				<div>
					<label  className="mt-3" htmlFor="phone">Phone</label><br />
					<input type='phone' name="phone" id="phone" placeholder="+380" />
				</div>
				<div>
					<label  className="mt-3" htmlFor="password">Password</label><br />
					<input type='password' name="password" id="password" />
				</div>								
				<div>
					<button className={styles.submitBtn}>SUBMIT</button>
				</div>
			</form>

		</div>
	)
}

export default Registration;