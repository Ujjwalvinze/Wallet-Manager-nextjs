import { useWeb3Contract, useMoralis } from "react-moralis";
import { contractAddresses, abi } from "../constants";
import { useNotification, Form, Input, Button, ConnectButton } from "web3uikit";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { PlanCard, Typography } from "web3uikit";

const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr;

    const separator = "...";
    const seperatorLength = separator.length;
    const charsToShow = strLen - seperatorLength;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);
    return (
        fullStr.substring(0, frontChars) + separator + fullStr.substring(fullStr.length - backChars)
    );
};

const truncateBal = (bal) => {
    const balance = ethers.utils.formatUnits(bal, "ether");
    console.log(balance);
    return balance;
};

export default function AccountCard({ accountAddress }) {
    if (accountAddress == 0) {
        return <div></div>;
    }
    const { chainId: chainIdInHex, isWeb3Enabled, account } = useMoralis();
    const chainId = parseInt(chainIdInHex);
    const managerAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;

    const { runContractFunction } = useWeb3Contract();
    const dispatch = useNotification();

    const [balance, setBalance] = useState("0");

    console.log(accountAddress);

    const { runContractFunction: getBalanceOf } = useWeb3Contract({
        abi: abi,
        contractAddress: managerAddress,
        functionName: "getBalanceOf",
        params: { account: accountAddress },
    });

    async function updateUI() {
        const balanceFromCall = await getBalanceOf();
        setBalance(balanceFromCall);
    }

    useEffect(() => {
        if (isWeb3Enabled || account) {
            updateUI();
        }
    }, [isWeb3Enabled, account]);
    return (
        <div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <PlanCard
                    backgroundColor="black"
                    borderColor="#000000"
                    description={[
                        `Address : ${truncateStr(accountAddress, 10)}`,
                        `Balance : ${truncateBal(balance)} ETH`,
                    ]}
                    descriptionTitle={
                        <Typography color="#041836" variant="caption14" weight="semibold">
                            Account info :-
                        </Typography>
                    }
                    footer={
                        <Button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                window.location.href = "/manageAccount";
                            }}
                            isFullWidth
                            text="Manage Funds"
                            theme="primary"
                        />
                    }
                    horizontalLine
                    subTitle={
                        <Typography color="#041836" variant="subtitle1" weight="600">
                            Account
                        </Typography>
                    }
                    title={
                        <Typography color="#041836" variant="subtitle1" weight="600">
                            {truncateStr(accountAddress, 25)}
                        </Typography>
                    }
                />
            </div>
        </div>
    );
}
