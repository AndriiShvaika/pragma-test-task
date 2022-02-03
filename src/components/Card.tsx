import { ethers } from 'ethers';

import './Card.css';

type CardProps = {
  name: string;
  percentageChange: string;
  ethPriceInWei: string;
  usdCapitalization: string;
  usdPriceInCents: string;
};

const Card = ({
  name,
  percentageChange,
  ethPriceInWei,
  usdCapitalization,
  usdPriceInCents,
}: CardProps) => {
  if (!percentageChange.includes('-')) {
    percentageChange = '+' + percentageChange;
  }

  usdCapitalization =
    usdCapitalization.slice(0, 1) +
    ',' +
    usdCapitalization.slice(1, 4) +
    ',' +
    usdCapitalization.slice(4, 7) +
    '.' +
    usdCapitalization.slice(7, 9);

  return (
    <div className="card">
      <div className="card-top">
        <h4 className="card-title">{name}</h4>
        <span className="card-eth-price">
          100$ / {ethers.utils.formatEther(ethPriceInWei)} ETH
        </span>
      </div>
      <div className="card-bottom">
        <h5 className="card-price">${usdCapitalization}</h5>
        <span className="card-percents">{percentageChange}%</span>
      </div>
    </div>
  );
};

export default Card;
