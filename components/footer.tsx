import React from "react";

const Footer = () => {
	return (
		<>
			<div className="bg-secondaryPrimary text-secondary flex flex-row items-center justify-evenly">
			// columns will probably be h3 -> ul -> li -> a (order of elements)
				<div className="flex flex-col gap-2 p-4 w-max"></div>
				<div className="flex flex-col gap-2 p-4 w-max"></div>
				<div className="flex flex-col gap-2 p-4 w-max"></div>
			</div>
		</>
	)
}

export default Footer;