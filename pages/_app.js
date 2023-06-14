"use client";
import Head from "next/head";
import "antd/dist/reset.css";
import "../styles/globals.scss";
import Layout from "@/containers/layout";
import "bootstrap-icons/font/bootstrap-icons.css";

function MyApp({ Component, pageProps }) {

    return (
        <>
            <Layout>
                <Head>
                    <title>Harbor Protocol</title>
                    <link rel="shortcut icon" href="/assets/favicon.ico" />
                </Head>
                <Component {...pageProps} />
            </Layout>
        </>
    );
}

export default MyApp;
