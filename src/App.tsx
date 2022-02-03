import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import ClipLoader from 'react-spinners/ClipLoader';

import { BigNumber, ethers } from 'ethers';
import MyContract from './contracts/MyContract.json';

import Card from './components/Card';

import './App.css';

type DataType = {
  index: string;
  name: string;
  ethPriceInWei: BigNumber;
  percentageChange: BigNumber;
  usdCapitalization: BigNumber;
  usdPriceInCents: BigNumber;
};

function App() {
  const [names, setNames] = useState<Array<string[]>>([]);
  const [DeFiData, setDeFiData] = useState<Array<object>>([]);
  const [OtherData, setOtherData] = useState<Array<object>>([]);
  const [isLoading, setLoading] = useState(true);

  const CONTRACT_ADDRESS = '0x4f7f1380239450AAD5af611DB3c3c1bb51049c29';

  const override = css`
    display: block;
    position: relative;
    margin: 0 auto;
    top: 40vh;
  `;

  useEffect(() => {
    const provider = ethers.getDefaultProvider('ropsten');

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      MyContract,
      provider
    );

    async function getData() {
      const tx1 = await contract.getGroupIds();

      const GroupIds = tx1.map((item: object) => Number(item.toString()));

      const Group = GroupIds.map(async (id: number) => {
        const tx2 = await contract.getGroup(id);
        return tx2;
      });

      let DeFiIdx: Array<number> = [];
      let OtherIdx: Array<number> = [];

      Promise.all(Group).then(function (results) {
        results.map(async (item) => {
          setNames((prevArray) => [...prevArray, item.name]);

          switch (item.name) {
            case 'DeFi Indexes':
              item.indexes.map((idx: string) =>
                DeFiIdx.push(Number(idx.toString()))
              );
              break;
            case 'Other Indexes':
              item.indexes.map((idx: string) =>
                OtherIdx.push(Number(idx.toString()))
              );
              break;
            default:
              console.log('There is no such section');
          }
        });

        const DeFiData = DeFiIdx.map(async (idx: number) => {
          const tx3 = await contract.getIndex(idx);
          return Object.assign({ index: idx }, tx3);
        });

        const OtherData = OtherIdx.map(async (idx: number) => {
          const tx3 = await contract.getIndex(idx);
          return Object.assign({ index: idx }, tx3);
        });

        Promise.all(DeFiData).then(function (results) {
          setDeFiData(results);
        });

        Promise.all(OtherData).then(function (results) {
          setOtherData(results);

          setLoading(false);
        });
      });
    }

    getData();
  }, []);

  return (
    <div className="app">
      {isLoading ? (
        <ClipLoader loading={isLoading} css={override} size={150} />
      ) : (
        <>
          <header className="header">
            <div className="container">
              <div className="header-content">
                <h3 className="header-logo">Logotype</h3>
                <button className="header-button">Connect wallet</button>
              </div>
              <h1 className="header-title">All Indeces</h1>
            </div>
          </header>

          <section className="assets">
            <div className="container">
              <h2 className="assets-title">{names[0]}</h2>
              <div className="assets-cards-wrapper">
                {DeFiData.map((item: any) => (
                  <Card
                    key={item.index}
                    name={item.name}
                    percentageChange={item.percentageChange.toString()}
                    ethPriceInWei={item.ethPriceInWei.toString()}
                    usdCapitalization={item.usdCapitalization.toString()}
                    usdPriceInCents={item.usdPriceInCents.toString()}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="assets">
            <div className="container">
              <h2 className="assets-title">{names[1]}</h2>
              <div className="assets-cards-wrapper">
                {OtherData.map((item: any) => (
                  <Card
                    key={item.index}
                    name={item.name}
                    percentageChange={item.percentageChange.toString()}
                    ethPriceInWei={item.ethPriceInWei.toString()}
                    usdCapitalization={item.usdCapitalization.toString()}
                    usdPriceInCents={item.usdPriceInCents.toString()}
                  />
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default App;
