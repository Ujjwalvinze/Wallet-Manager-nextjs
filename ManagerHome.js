import { useWeb3Contract, useMoralis } from "react-moralis";
import { contractAddresses, abi } from "../../constants";
import { useNotification, Form, Input, Button, ConnectButton } from "web3uikit";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { HeaderHome } from "../../components/HeaderHome";
import AccountCard from "components/AccountCard";

import styles from "@/styles/Home.module.css";

export default function ManagerHome() {
    /// Variables
    const { chainId: chainIdInHex, isWeb3Enabled, account } = useMoralis();
    const chainId = parseInt(chainIdInHex);
    const managerAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;

    const { runContractFunction } = useWeb3Contract();
    const dispatch = useNotification();

    const [ownerOfAccount, setOwnerOfAccount] = useState("0");
    const [allAccounts, setAllAccounts] = useState(["0"]);

    console.log(managerAddress);

    // Contract Functions

    // const { runContractFunction: getAccounts } = useWeb3Contract({
    //     abi: abi,
    //     contractAddress: managerAddress,
    //     functionName: "getAccounts",
    //     params: {},
    // });

    const runGetAccounts = async function () {
        const getAccountParams = {
            abi: abi,
            contractAddress: managerAddress,
            functionName: "getAccounts",
            params: {},
        };

        const addresses = await runContractFunction({
            params: getAccountParams,
            onError: (error) => {
                console.log(error);
            },
        });

        setAllAccounts(addresses);
        console.log(allAccounts);
    };

    const { runContractFunction: getBalanceOf } = useWeb3Contract({
        abi: abi,
        contractAddress: managerAddress,
        functionName: "getBalanceOf",
        params: { account: account },
    });

    const { runContractFunction: getWithdrawAmount } = useWeb3Contract({
        abi: abi,
        contractAddress: managerAddress,
        functionName: "getWithdrawAmount",
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
            onSuccess: handleSuccess,
            onError: handleFailure,
        });
    };

    const runAddAccount = async function (data) {
        const ownerForAddAccount = data.data[0].inputResult;
        console.log(`Owner For Add Account : ${ownerForAddAccount}`);

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
    };

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
            onSuccess: handleSuccess,
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
            onSuccess: handleSuccess,
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
            onSuccess: handleSuccess,
            onError: (error) => {
                console.log(error);
            },
        });
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
            icon: "bell",
        });
    };

    const handleFailure = function () {
        dispatch({
            type: "info",
            message: "Transaction Failure",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
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

    return (
        <main className={styles.mainAddAccount}>
            <ConnectButton moralisAuth={false} />

            {managerAddress ? (
                <div>
                    <div>The current address is : {account}</div>
                    <div>Owner of Account is : {ownerOfAccount}</div>

                    <div>
                        <Button onClick={runGetAccounts} theme="primary" text="Show Accounts" />
                    </div>
                    <div>
                        Accounts :{" "}
                        {allAccounts.map((acc) => {
                            return <AccountCard accountAddress={acc} />;
                        })}
                    </div>
                    <div>
                        <Button onClick={runCreateManager} theme="primary" text="Create Manager" />
                    </div>
                    <div>
                        <Form
                            buttonConfig={{ theme: "primary" }}
                            onSubmit={runAddAccount}
                            data={[
                                {
                                    name: "Owner To Add",
                                    type: "text",
                                    inputWidth: "50%",
                                    value: "",
                                    key: "ownerAddress",
                                },
                            ]}
                            title="Add account to :-"
                            id="Account Form"
                        />
                    </div>
                </div>
            ) : (
                <div>Connect to the chain</div>
            )}
        </main>
    );
}
