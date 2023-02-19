import { useWeb3Contract, useMoralis } from "react-moralis";
import { contractAddresses, abi } from "../../constants";
import { useNotification, Form, Input, Button, ConnectButton, TabList, Tab } from "web3uikit";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import styles from "@/styles/Home.module.css";

export default function AddAccount() {
    const { chainId: chainIdInHex, isWeb3Enabled, account } = useMoralis();
    const chainId = parseInt(chainIdInHex);
    const managerAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
    const [ownerAccount, setOwnerAccount] = useState("0");

    const { runContractFunction } = useWeb3Contract();
    const dispatch = useNotification();

    const runAddAccount = async function (data) {
        const ownerForAddAccount = data.data[0].inputResult;

        const addAccountParams = {
            abi: abi,
            contractAddress: managerAddress,
            functionName: "addAccount",
            params: { ownerAccount: ownerForAddAccount },
        };

        await runContractFunction({
            params: addAccountParams,
            onSuccess: handleSuccess,
            onError: (error) => {
                console.log(error);
            },
            onError: handleFailure,
        });

        setOwnerAccount(ownerForAddAccount);
    };
    const runDeleteManager = async function () {
        const deleteManagerParams = {
            abi: abi,
            contractAddress: managerAddress,
            functionName: "deleteManager",
            params: {},
        };

        await runContractFunction({
            params: deleteManagerParams,
            onSuccess: handleSuccess,
            onError: (error) => {
                console.log(error);
            },
            onError: handleFailure,
        });
    };

    const runDeleteAccount = async function (data) {
        const accountToDelte = data.data[0].inputResult;
        const deleteAccountParams = {
            abi: abi,
            contractAddress: managerAddress,
            functionName: "deleteAccount",
            params: { account: accountToDelte },
        };

        await runContractFunction({
            params: deleteAccountParams,
            onSuccess: handleSuccess,
            onError: (error) => {
                console.log(error);
            },
            onError: handleFailure,
        });
    };

    // Handle Notifications

    const handleSuccess = async function (tx) {
        await tx.wait(1);
        handleNotification(tx);
    };

    const handleNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Transaction Notification",
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

    return (
        <main className={styles.mainAddAccount}>
            <h1 className={styles.h1}>
                {/* <Typography color="#000000" variant="h2"> */}
                Connect The Account: <ConnectButton moralisAuth={false} />
                {/* </Typography> */}
            </h1>
            <div>
                {managerAddress ? (
                    <div>
                        <TabList tabStyle="bulbSeperate">
                            <Tab tabKey={1} tabName="Add new Account">
                                <Form
                                    className={styles.transparent}
                                    buttonConfig={{ theme: "primary" }}
                                    onSubmit={runAddAccount}
                                    data={[
                                        {
                                            name: "Owner Address",
                                            type: "text",
                                            inputWidth: "50%",
                                            value: "",
                                            key: "ownerAddress",
                                            validation: {
                                                required: true,
                                            },
                                        },
                                    ]}
                                    title="Add account to Owner:-"
                                    id="Account Form"
                                />
                            </Tab>
                            <Tab tabKey={2} tabName="Delete Account">
                                <div>
                                    <Form
                                        buttonConfig={{ theme: "primary" }}
                                        onSubmit={runDeleteAccount}
                                        data={[
                                            {
                                                name: "Accout To Be Deleted",
                                                type: "text",
                                                inputWidth: "50%",
                                                value: "",
                                                key: "deleteAddress",
                                                validation: {
                                                    required: true,
                                                },
                                            },
                                        ]}
                                        title="Delete This Account (Only Owners are allowed)"
                                    />
                                </div>
                            </Tab>
                            <Tab tabKey={3} tabName="Delete Manager">
                                <div>
                                    <Button
                                        onClick={runDeleteManager}
                                        theme="primary"
                                        text="Delete The manager"
                                    />
                                </div>
                            </Tab>
                        </TabList>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
            <div>
                <Button onClick={runRefresh} theme="translucent" text="Refresh" />
            </div>
        </main>
    );
}
