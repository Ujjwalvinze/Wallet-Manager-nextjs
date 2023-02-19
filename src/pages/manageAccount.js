import { useWeb3Contract, useMoralis } from "react-moralis";
import { contractAddresses, abi } from "../../constants";
import { useNotification, Form, Input, Button, ConnectButton, TabList, Tab } from "web3uikit";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import styles from "@/styles/Home.module.css";

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

export default function ManagerHome() {
    /// Variables
    const { chainId: chainIdInHex, isWeb3Enabled, account } = useMoralis();
    const chainId = parseInt(chainIdInHex);
    const managerAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;

    const { runContractFunction } = useWeb3Contract();
    const dispatch = useNotification();

    const [ownerOfAccount, setOwnerOfAccount] = useState("0");

    console.log(managerAddress);

    // Contract Functions

    const { runContractFunction: getBalanceOf } = useWeb3Contract({
        abi: abi,
        contractAddress: managerAddress,
        functionName: "getBalanceOf",
        params: { account: account },
    });

    const { runContractFunction: getOwnerOf } = useWeb3Contract({
        abi: abi,
        contractAddress: managerAddress,
        functionName: "getOwnerOf",
        params: { account: account },
    });

    const runTransferTo = async function (data) {
        const transferToAccount = data.data[0].inputResult;
        const transferAmount = ethers.utils.parseEther(data.data[1].inputResult.toString());
        console.log(`Transfer to Account : ${transferToAccount}`);
        console.log(`Transfer amount : ${transferAmount}`);
        const transferToParams = {
            abi: abi,
            contractAddress: managerAddress,
            functionName: "transferTo",
            msgValue: transferAmount,
            params: { account: transferToAccount },
        };
        // msgValue: transferAmount,

        await runContractFunction({
            params: transferToParams,
            onSuccess: handleTransferSuccess,
            onError: handleFailure,
            onError: (error) => {
                console.log(error);
            },
            // onError: handleFailure,
        });
    };

    const runTransferAll = async function () {
        let val = await getBalanceOf();

        val = val * 0.99;
        // console.log(val);
        const transferAllParams = {
            abi: abi,
            contractAddress: managerAddress,
            functionName: "transferAll",
            msgValue: val,
            params: {},
        };

        await runContractFunction({
            params: transferAllParams,
            onSuccess: handleTransferSuccess,
            onError: handleFailure,
            onError: (error) => {
                console.log(error);
            },
        });
    };

    const runWithdraw = async function () {
        // let val = await getWithdrawAmount();

        // console.log(val);
        const withdrawParams = {
            abi: abi,
            contractAddress: managerAddress,
            functionName: "withdraw",
            params: {},
        };

        await runContractFunction({
            params: withdrawParams,
            onSuccess: handleWithdrawSuccess,
            onError: handleFailure,
            onError: (error) => {
                console.log(error);
            },
        });
    };

    // Handle Notifications

    const handleTransferSuccess = async function (tx) {
        await tx.wait(1);
        handleTransferNotification(tx);
    };

    const handleTransferNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Transferred",
            position: "topR",
        });
    };

    const handleWithdrawSuccess = async function (tx) {
        await tx.wait(1);
        handleWithdrawNotification(tx);
    };

    const handleWithdrawNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Withdrawn",
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

    async function updateUI() {
        const ownerFromCall = await getOwnerOf();
        setOwnerOfAccount(ownerFromCall);
    }

    useEffect(() => {
        if (isWeb3Enabled || account || ownerOfAccount) {
            updateUI();
        }
    }, [isWeb3Enabled, ownerOfAccount, account]);

    const runRefresh = async function () {
        window.location.reload(false);
    };

    return (
        <main className={styles.mainAddAccount}>
            <div>
                <ConnectButton moralisAuth={false} />
            </div>
            <div>
                {managerAddress ? (
                    <div>
                        <TabList tabStyle="bulbSeperate">
                            <Tab tabKey={1} tabName="Withdraw All Funds">
                                <div className={styles.h1}>Click To Withdraw All Amount</div>
                                <Button onClick={runWithdraw} theme="primary" text="Withdraw" />
                            </Tab>
                            <Tab tabKey={2} tabName="Transfer">
                                <div>
                                    <Form
                                        className={styles.transparent}
                                        buttonConfig={{ theme: "primary" }}
                                        onSubmit={runTransferTo}
                                        data={[
                                            {
                                                name: "Account Address",
                                                type: "text",
                                                inputWidth: "50%",
                                                value: "",
                                                key: "accountAddress",
                                                validation: {
                                                    required: true,
                                                },
                                            },
                                            {
                                                name: "Transfer Amount",
                                                type: "text",
                                                inputWidth: "50%",
                                                value: "",
                                                key: "transferAmount",
                                                validation: {
                                                    required: true,
                                                },
                                            },
                                        ]}
                                        title="Add account to :-"
                                        id="Account Form"
                                    />
                                    <div className={styles.h1}>
                                        Transfer All The Amount To Owner Account
                                        <Button
                                            onClick={runTransferAll}
                                            theme="primary"
                                            text="TransferAll"
                                        />
                                    </div>
                                    <div className={styles.h1}>
                                        Refresh Page To Transfer Again
                                        <Button
                                            onClick={runRefresh}
                                            theme="primary"
                                            text="Transfer Again"
                                        />
                                    </div>
                                    {/* <Form
                                        buttonConfig={{ theme: "primary" }}
                                        onSubmit={runTransferAll}
                                        title="Transfer All The Amount To Owner Account"
                                    />
                                    <Form
                                        buttonConfig={{ theme: "primary" }}
                                        onSubmit={runRefresh}
                                        title="Transfer Again"
                                    /> */}
                                </div>
                            </Tab>
                        </TabList>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        </main>
    );
}
