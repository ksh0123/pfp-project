import { FC, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { NftMetadata, OutletContext } from "../types";
import axios from "axios";

const Home: FC = () => {
  const [searchTokenId, setSearchTokenId] = useState<number>(0);
  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);

  const { mintNftContract } = useOutletContext<OutletContext>();

  const getTotalSupply = async () => {
    try {
      if (!mintNftContract) return;

      const totalNFT = await mintNftContract.methods.totalSupply().call();

      setSearchTokenId(Number(totalNFT));
    } catch (error) {
      console.error(error);
    }
  };

  const getNFTs = async () => {
    try {
      if (!mintNftContract) return;

      let temp: NftMetadata[] = [];

      for (let i = 0; i < 4; i++) {
        const metadataURI: string = await mintNftContract.methods
          // @ts-expect-error
          .tokenURI(searchTokenId - i)
          .call();

        const response = await axios.get(metadataURI);

        temp.push({ ...response.data, tokenId: searchTokenId });
      }

      setSearchTokenId(searchTokenId - 4);
      setMetadataArray(temp);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTotalSupply();
  }, [mintNftContract]);

  useEffect(() => {
    if (searchTokenId === 0) return;

    getNFTs();
  }, [searchTokenId]);

  useEffect(() => console.log(metadataArray), [metadataArray]);

  return <div className="grow bg-green-100">Home</div>;
};

export default Home;
