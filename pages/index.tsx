import React from "react";
import Head from 'next/head';
import Link from 'next/link';

const Index = () => {
	return (
		<>
			<Head>
				<title>Home - Kaow</title>
			</Head>
			<main className="bg-bg text-white w-full h-screen">
				<Link href="/signup"><a className="p-1">signup</a></Link>
				<Link href="/profile"><a className="p-1">profile</a></Link>
				<Link href="/stacks/new"><a className="p-1">stacks</a></Link>
				<Link href="/projects/new"><a className="p-1">projects</a></Link>
			</main>
		</>
	)
};

export default Index;