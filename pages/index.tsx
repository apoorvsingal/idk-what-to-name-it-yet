import React from "react";
import Head from 'next/head';
import Link from 'next/link';

const Index = () => {
	return (
		<>
			<Head>
				<title>Home - Kaow</title>
			</Head>
			<main className="bg-primary text-secondary w-full h-screen">
				<nav className="bg-primaryDark p-5 flex justify-between">
					<navlinks className="flex justify-start gap-4">
						<Link href="/profile"><a>profile</a></Link>
						<Link href="/stacks/new"><a>stacks</a></Link>
						<Link href="/projects/new"><a>projects</a></Link>
					</navlinks>
					<Link href="/signup"><a className="pl-4">signup</a></Link>
				</nav>
				<hero className="flex w-full h-2/4">
				</hero>
			</main>
		</>
	)
};

export default Index;