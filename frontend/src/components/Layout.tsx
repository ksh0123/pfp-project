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
        "0x1e3762e95365395f862241e7a4099b94bed2afaf"
      )
    );
  }, [web3]);

  return (
    <div className="bg-red-100 min-h-screen max-w-screen-md mx-auto">
      <Header account={account} setAccount={setAccount} />
      <Outlet context={{ account, web3, mintNftContract }} />
    </div>
  );
};

export default Layout;
