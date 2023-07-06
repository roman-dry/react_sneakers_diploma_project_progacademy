import React, { useContext } from "react";
import { AppContext } from "../App";

import styles from './Drawer/Drawer.module.scss';

function Info({ image, title, description, confirm_button }) {
	const { setOpenDrawer } = useContext(AppContext);
	return (
		<div className="d-flex align-items-center justify-content-center flex-column">
			<img width="120px" src={image} alt="Empty" />
			<h3 className="mt-5"><b>{title}</b></h3>
			<p className="mt-1">{description}</p>
			{confirm_button}
			<button className={`${styles.closeBtn} + ' mt-5'`} onClick={() => setOpenDrawer(false)}>
				Back
			</button>
		</div>
	)
}

export default Info;
 