import { FC } from "react";
import { Link } from "react-router-dom";

interface MyNftCardProps {
  image: string;
  name: string;
  tokenId: number;
}

const MyNftCard: FC<MyNftCardProps> = ({ image, name, tokenId }) => {
  const onMouseEnter = () => {
    console.log("onMouseEnter");
  };

  const onMouseLeave = () => {
    console.log("onMouseLeave");
  };

  return (
    <li className="relative" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Link to={`/detail/${tokenId}`}>
        <img src={image} alt={name} />
        <div className="font-semibold mt-1">{name}</div>
      </Link>
      {isHover && (<div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-50"></div>)}
    </li>
  );
};

export default MyNftCard;
