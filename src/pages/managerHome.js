import { useWeb3Contract, useMoralis } from "react-moralis";
import { contractAddresses, abi } from "../../constants";
import { useNotification, Form, Input, Button, ConnectButton, CryptoLogos } from "web3uikit";
import { useEffect, useState } from "react";
import AccountCard from "components/AccountCard";

import { gql, useQuery } from "@apollo/client";
import OWNER_TO_ACCOUNTS_ITEMS from "../../constants/subgraphQueries";

import styles from "@/styles/Home.module.css";

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

export default function ManagerHome() {
    const { loading, error, data: ownerToAccountsData } = useQuery(OWNER_TO_ACCOUNTS_ITEMS);

    // if (!loading) {
    //     console.log(ownerToAccountsData.ownerToAccounts);
    // }

    /// Variables
    const { chainId: chainIdInHex, isWeb3Enabled, account } = useMoralis();
    const chainId = parseInt(chainIdInHex);
    const managerAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;

    const { runContractFunction } = useWeb3Contract();
    const dispatch = useNotification();

    const [ownerOfAccount, setOwnerOfAccount] = useState("0");

    // Contract Functions

    const { runContractFunction: getAccounts } = useWeb3Contract({
        abi: abi,
        contractAddress: managerAddress,
        functionName: "getAccounts",
        params: {},
    });

    const { runContractFunction: getOwnerOf } = useWeb3Contract({
        abi: abi,
        contractAddress: managerAddress,
        functionName: "getOwnerOf",
        params: { account: account },
    });

    const runCreateManager = async function () {
        const createManagerParams = {
            abi: abi,
            contractAddress: managerAddress,
            functionName: "createManager",
            params: {},
        };

        await runContractFunction({
            params: createManagerParams,
            onSuccess: handleCreateManagerSuccess,
            onError: handleFailure,
        });
    };

    // Handle Notifications

    const handleCreateManagerSuccess = async function (tx) {
        await tx.wait(1);
        handleNotification(tx);
    };

    const handleNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Manager Created",
            position: "topR",
        });
    };

    const handleFailure = function () {
        dispatch({
            type: "info",
            message: "Transaction Failure",
            title: "Transaction Notification",
            position: "topR",
        });
    };

    async function runRefresh() {
        window.location.reload(false);
    }

    async function updateUI() {
        const ownerFromCall = await getOwnerOf({
            onError: (error) => {
                console.log(error);
            },
        });
        setOwnerOfAccount(ownerFromCall);
    }

    useEffect(() => {
        if (isWeb3Enabled || account || ownerOfAccount) {
            updateUI();
        }
    }, [isWeb3Enabled, ownerOfAccount, account]);

    return (
        <main className={styles.mainManager}>
            <div className={styles.gridManager}>
                <div>
                    <CryptoLogos chain="ethereum" size="48px" />
                </div>
                <div className={styles.gridManager2}>
                    <h1 className={styles.h1}>
                        <ConnectButton moralisAuth={false} />
                    </h1>
                </div>
            </div>
            {managerAddress ? (
                <div>
                    <div>
                        {ownerOfAccount == NULL_ADDRESS ? (
                            <div>
                                {" "}
                                <Button
                                    onClick={runCreateManager}
                                    theme="primary"
                                    text="Create Manager"
                                />
                            </div>
                        ) : (
                            <div>
                                {!loading ? (
                                    <div className={styles.gridAccountCards}>
                                        {ownerToAccountsData.ownerToAccounts.map((items) => {
                                            const { ownerAccount, account: acc } = items;
                                            if (ownerAccount == ownerOfAccount.toLowerCase()) {
                                                return (
                                                    <AccountCard
                                                        accountAddress={acc}
                                                        ownerAddress={ownerAccount}
                                                    />
                                                );
                                            }
                                        })}
                                    </div>
                                ) : (
                                    <div>Loading...</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div></div>
            )}
            <div>
                <Button onClick={runRefresh} theme="primary" text="Refresh" />
            </div>
        </main>
    );
}
