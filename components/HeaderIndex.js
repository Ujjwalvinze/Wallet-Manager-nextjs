import { ConnectButton, Link } from "web3uikit";
import { Hero, Button, Typography, React, Illustration } from "web3uikit";
import styles from "@/styles/Home.module.css";
import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function HeaderIndex() {
    return (
        <Hero
            align="left"
            backgroundColor="#000000"
            backgroundURL="https://moralis.io/wp-content/uploads/2021/06/blue-blob-background-2.svg"
            height="176px"
            rounded="20px"
            textColor="#FFFFFF"
        >
            <div className={styles.grid}>
                <a href="/" className={styles.card} target="_self" rel="noopener noreferrer">
                    <h2 className={inter.className}>Piper Wallet</h2>
                </a>

                <div className={styles.grid}>
                    <Button
                        theme="translucent"
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            window.location.href = "/managerHome";
                        }}
                        text="MANAGER"
                    />
                    <Button
                        theme="translucent"
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            window.location.href = "/addAccount";
                        }}
                        text="ADD / DELETE ACCOUNT"
                    />
                </div>
            </div>
        </Hero>
    );
}
