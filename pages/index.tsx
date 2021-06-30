import React from "react";
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/navbar.tsx';

const Index = () => {
	return (
		<main className="bg-primary text-secondary w-full h-screen overflow-x-hidden">
			<Head>
				<title>Home - Kaow</title>
			</Head>
			<Navbar />
				<hero className="flex w-full h-2/4"></hero>
				<section className="flex items-start flex-col sm:flex-row justify-center sm:justify-evenly bg-secondaryPrimaryLight text-secondaryDarkr p-3 sm:p60 gap-1 sm:gap-3 md:gap-4">
					<article className="w-full p-2">
						<h3 className="font-medium lg:text-3xl text-xl sm:text-2xl text-center sm:text-left pb-1.5 sm:pb-0.5 sm:py-2">What is kaow?</h3>
						<p className="font-
						extralight text-sm sm:text-base leading-snug">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
					</article>

					<article className="w-full p-2">
						<h3 className="font-medium lg:text-3xl text-xl sm:text-2xl text-center sm:text-left pb-1.5 sm:pb-0.5 sm:py-2">Why should I use Kaow?</h3>
						<p className="font-
						extralight text-sm sm:text-base leading-snug">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
					</article>

					<article className="w-full p-2">
						<h3 className="font-medium lg:text-3xl text-xl sm:text-2xl text-center sm:text-left pb-1.5 sm:pb-0.5 sm:py-2">How do I get started!</h3>
						<p className="font-
						extralight text-sm sm:text-base leading-snug">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
					</article>
				</section>

				<section className="flex items-start flex-col sm:flex-row justify-center sm:justify-evenly text-secondaryPrimaryLight bg-secondaryDark p-3 sm:p-6 gap-2 sm:gap-4">

					<article className="w-full p-2">
						<h3 className="font-medium lg:text-4xl text-4xl pb-0.5 sm:py-2">Placeholder</h3>
						<ul className="px-3 pt-1">
							<li className="text-base pb-1">
								Lorem Ipsum Dolor Sit Amet
							</li>
							<li className="text-lg pb-1">
								consectetur adipiscing elit
							</li>
							<li className="text-lg pb-1">
								ut labore et dolore magna aliqua
							</li>
							<li className="text-lg pb-1">
								 Ut enim ad minim veniam
							</li>
							<li className="text-base">
								sed do eiusmod tempor incididunt
							</li>
						</ul>
					</article>
				</section>
		</main>
	)
};

export default Index;