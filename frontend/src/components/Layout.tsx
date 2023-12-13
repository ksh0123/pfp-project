import { FC, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Web3, { Contract, ContractAbi } from "web3";
import { useSDK } from "@metamask/sdk-react";

import Header from "./Header";
import mintNftAbi from "../abis/mintNftAbi.json";

export interface OutletContext {
  account: string;
  web3: Web3;
  mintNftContract: Contract<ContractAbi>;
}

const Layout: FC = () => {
  const [account, setAccount] = useState<string>("");
  const [web3, setWeb3] = useState<Web3>();
  const [mintNftContract, setMintNftContract] =
    useState<Contract<ContractAbi>>();

  const { provider } = useSDK();

  useEffect(() => {
    if (!provider) return;

    setWeb3(new Web3(provider));
  }, [provider]);

  useEffect(() => {
    if (!web3) return;

    setMintNftContract(
      new web3.eth.Contract(
        mintNftAbi,
        "0xc3059b14bb5a8910d135d13ecd1d874b01d48010"
      )
    );
  }, [web3]);

  return (
    <div className="bg-red-100 min-h-screen max-w-screen-md mx-auto flex flex-col">
      <Header account={account} setAccount={setAccount} />
      <Outlet context={{ account, web3, mintNftContract }} />
    </div>
  );
};

export default Layout;
