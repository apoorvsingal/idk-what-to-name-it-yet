import React from "react";
import Head from 'next/head';
import Link from 'next/link';

const Index = () => {
	return (
		<>
			<Head>
				<title>Home - Kaow</title>
			</Head>
			<main className="bg-bg text-white w-screen h-screen">
				<Link href="/signup"><a>signup</a></Link>
				<Link href="/profile"><a>profile</a></Link>
				<Link href="/stacks/new"><a>idk</a></Link>
			</main>
		</>
	)
};

export default Index;