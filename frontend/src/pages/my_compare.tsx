import { FC, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";
import MintModal from "../components/MintModal";

import axios from "axios";
import MyNftCard from "../components/MyNftCard";

const My: FC = () => {
  const { mintNftContract, account } = useOutletContext<MyOutletContext>();
  // Layout 에 인터페이스 export로 받아옴.
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);

  const getMyNft = async () => {
    try {
      if (!mintNftContract || !account) return;

      //@ts-expect-error
      const balance = await mintNftContract.methods.balanceOf(account).call();

      let temp: NftMetadata[] = [];

      for (let i = 0; i < Number(balance); i++) {
        const tokenId = await mintNftContract.methods
          //@ts-expect-error
          .tokenOfOwnerByIndex(account, i)
          .call();

        const metadataURI: string = await mintNftContract.methods
          //@ts-expect-error
          .tokenURI(tokenId)
          .call();

        const response = await axios.get(metadataURI);

        temp.push({ ...response.data, tokenId: Number(tokenId) });
        // 토큰아이디 포함.
      }
      setMetadataArray(temp);
    } catch (error) {
      console.warn("err");
    }
  };

  const onClickMintModal = () => {
    if (!account) return;

    setIsOpen(true);
  };

  useEffect(() => {
    getMyNft();
  }, [mintNftContract, account]);

  useEffect(() => {
    console.log(metadataArray);
  }, [metadataArray]);

  return (
    <>
      <div className=" grow">
        <div className="text-right p-2">
          <button className="hover:text-gray-500" onClick={onClickMintModal}>
            Mint
          </button>
        </div>
        <div className="text-center py-8">
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
            // ! 존재한다
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
