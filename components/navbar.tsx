import Link from 'next/link';
import React from 'react';
import Image from 'next/image';


// mobile nav because too lazy to fix js
const MobileNav = () => {
	return (
		<span className="hidden w-full flex flex-start" id="links">
			<span className="flex flex-col justify-start gap-2 w-full sm:hidden">
				<Link href="/profile"><a className="py-2 px-3 flex flex-stretch hover:bg-primary active:bg-primary rounded-md transition duration-100">profile</a></Link>
				<Link href="/stacks/new"><a className="py-2 px-3 flex flex-stretch hover:bg-primary active:bg-primary rounded-md transition duration-100">stacks</a></Link>
				<Link href="/projects/new"><a className="py-2 px-3 flex flex-stretch hover:bg-primary active:bg-primary rounded-md transition duration-100">projects</a></Link>
				<Link href="/signup"><a className="py-2 px-3 flex flex-stretch hover:bg-primary active:bg-primary rounded-md transition duration-100">signup</a></Link>
			</span>
		</span>
	)
}


// someone think of a better name for thid function
const LargerScreensNav = () => {
	return (
		<span className="hidden sm:block">
			<span className="flex flex-row justify-start gap-2 w-4/5 p-2">
				<Link href="/profile"><a className="flex">profile</a></Link>
				<Link href="/stacks/new"><a className="flex">stacks</a></Link>
				<Link href="/projects/new"><a className="flex">projects</a></Link>
				<Link href="/signup"><a className="flex">signup</a></Link>
			</span>
		</span>
	)
}

const Navbar = () => {
	const navLinksToggle = () => {
		let x = document.getElementById('links');
		(x.style.display === "block") ? x.style.display = "none" : x.style.display = "block";
	}
	return (
		<nav className="bg-primaryDark p-2 sm:p-5 flex items-center relative h-auto w-full">
			<span className="flex flex-col sm:flex-row items-start w-full">
				<span className="flex justify-between items-center w-full">
				<Link href="/">
					<a><Image src="/kaow.png" width="20" height="20" className="cursor-pointer" /></a>
				</Link>
					<button className="outline-none border-none p-2.5 cursor-pointer flex justify-center items-center focus:outline-none active:bg-primary hover:bg-primary rounded-md transition duration-100 sm:hidden" onClick={navLinksToggle}>
						<svg viewBox="0 0 100 80" width="20" height="20" className="fill-current outline-none">
							<rect width="100" height="10"></rect>
							<rect y="30" width="100" height="10"></rect>
							<rect y="60" width="100" height="10"></rect>
						</svg>
					</button>
				</span>
				<MobileNav />
				<LargerScreensNav />
			</span>
		</nav>
	)
}

export default Navbar;