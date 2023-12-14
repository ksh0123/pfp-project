import { FC, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";
import MintModal from "../components/MintModal";

import axios from "axios";
import MyNftCard from "../components/NftCard";
import { NftMetadata } from "../types";

const My: FC = () => {
  const { mintNftContract, account } = useOutletContext<OutletContext>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);

  const getMyNFTs = async () => {
    try {
      if (!mintNftContract || !account) return;

      // @ts-expect-error
      const balance = await mintNftContract.methods.balanceOf(account).call();

      let temp: NftMetadata[] = [];

      for (let i = 0; i < Number(balance); i++) {
        const tokenId = await mintNftContract.methods
          // @ts-expect-error
          .tokenOfOwnerByIndex(account, i)
          .call();

        const metadataURI: string = await mintNftContract.methods
          // @ts-expect-error
          .tokenURI(tokenId)
          .call();

        const response = await axios.get(metadataURI);

        temp.push({ ...response.data, tokenId: Number(tokenId) });
      }

      setMetadataArray(temp);
    } catch (error) {
      console.error(error);
    }
  };

  const onClickMintModal = () => {
    if (!account) return;

    setIsOpen(true);
  };

  useEffect(() => {
    getMyNFTs();
  }, [mintNftContract, account]);

  useEffect(() => {
    console.log(metadataArray);
  }, [metadataArray]);

  return (
    <>
      <div className="bg-green-100 grow">
        <div className="bg-purple-100 text-right p-2">
          <button className="hover:text-gray-500" onClick={onClickMintModal}>
            Mint
          </button>
        </div>
        <div className="bg-pink-100 text-center py-8">
          <h1 className="font-bold text-2xl">My NFTs</h1>
        </div>
        <ul className="p-8 grid grid-cols-3 gap-2">
          {metadataArray?.map((v, i) => (
            <MyNftCard
              key={i}
              image={v.image}
              name={v.name}
              tokenId={v.tokenId!}
            />
          ))}
        </ul>
      </div>
      {isOpen && (
        <MintModal
          setIsOpen={setIsOpen}
          metadataArray={metadataArray}
          setMetadataArray={setMetadataArray}
        />
      )}
    </>
  );
};

export default My;
