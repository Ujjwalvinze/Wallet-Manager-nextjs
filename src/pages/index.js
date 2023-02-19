import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import HeaderIndex from "components/HeaderIndex";
import ListAccounts from "components/ListAccounts";

import { Wallet } from "@web3uikit/icons";
import { H1Styled, Typography, Illustration } from "web3uikit";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return (
        <>
            <Head>
                <title>Wallet Manager</title>
                <meta name="description" content="Wallet Manager" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <div className={styles.description}>
                    <h1>
                        Ever wished for a wallet manager for your Metamask? Well, Piper Wallet
                        brings you just that!. Piper Wallet is a wallet manager for all your wallet
                        accounts. With just a few clicks, you can transfer money between your
                        accounts quickly and conviniently.
                    </h1>
                </div>
                <div className={styles.gridManager2}>
                    <Illustration logo="chest" />
                </div>
            </main>
        </>
    );
}
