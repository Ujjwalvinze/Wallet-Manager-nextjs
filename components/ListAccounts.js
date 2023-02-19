import { useWeb3Contract, useMoralis } from "react-moralis";
import { contractAddresses, abi } from "../constants";
import { useNotification, Form, Input, Button } from "web3uikit";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function ListAccounts() {
    const { chainId: chainIdInHex, isWeb3Enabled, account } = useMoralis();
    const chainId = parseInt(chainIdInHex);
    const managerAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;

    const { runContractFunction } = useWeb3Contract();
    const dispatch = useNotification();

    const runGetAccounts = async function () {
        const getAccountsParams = {
            abi: abi,
            contractAddress: managerAddress,
            functionName: "getAccounts",
            params: {},
        };

        const accounts = await runContractFunction({
            params: getAccountsParams,
            onSuccess: handleSuccess,
            onError: (error) => {
                console.log(error);
            },
        });

        console.log(accounts);
    };

    const handleSuccess = async function (tx) {
        // await tx.wait(1);
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

    return (
        <div>
            {managerAddress ? (
                <div>
                    <Button onClick={runGetAccounts} theme="colored" text="Get Accounts"></Button>
                </div>
            ) : (
                <div>Connect from listaccounts</div>
            )}
        </div>
    );
}
