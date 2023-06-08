import React, { useState } from "react";
import axios from "axios";

function Shipping() {
	const [shipping, setShipping] = useState([]);
	//const styleLi = {list-style-type: "none"};

	async function getShipping() {
		try {
			const { data } = await axios.get('https://64440fc9466f7c2b4b60d1da.mockapi.io/items/shipping');
			setShipping(data);

			
		} catch (error) {
			//alert('Failed to get Shipping!')
			
		}
	}

	getShipping();

	return (<div className="p-4">
		<h3>Delivery Details: </h3>
		{
			shipping.map((obj) => {
				return <ul style={{listStyleType: "none"}} >
					<li>Order Number: {obj.id}</li>
					<li>Country: {obj.country}</li>
					<li>City: {obj.city}</li>
					<li>Address: {obj.address}</li>
					<li>Fullname: {obj.fullName}</li>
					<li>Phone: {obj.phone}</li>
					<li>Comment: {obj.size}</li>
				</ul>

			})
		}
	</div>

	);
}

export default Shipping;