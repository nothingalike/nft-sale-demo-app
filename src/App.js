import './App.css';
import React from 'react'
import { ConnectWalletList, ConnectWalletButton } from '@cardano-foundation/cardano-connect-with-wallet';
import Card from './components/card';
import { act } from 'react-dom/test-utils';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      nftsToSell: [],
      wallet: null,
      transaction: null
    };
  }

  componentDidMount() {
    this.fetchNfts();
  }
  
  fetchNfts() {
    this.setState({...this.state, isFetching: true});
    
    fetch(`https://localhost:5001/api/get-nfts`)
      .then((response) => response.json())
      .then((actualData) => {
        console.log(actualData);
        this.setState({...this.state, nftsToSell: actualData, isFetching: false});
      })
      .catch(e => {
          console.log(e);
          this.setState({...this.state, isFetching: false});
      });
  }

  async handleConnect(w) {
    if(w == "nami")
    {
      let x = await window.cardano.nami.enable();
      this.setState({...this.state, wallet: x});
    }
  }

  async buyNft(rarity) {
    let address = await this.state.wallet.getUsedAddresses();

    fetch(`https://localhost:5001/api/transaction/build`,
      {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rarity: rarity, addressByte: address[0] })
      })
      .then((response) => response.json())
      .then((actualData) => {
        this.setState({...this.state, nftSale: actualData.nftSale});
        console.log(actualData.nftSale.transactionCbor);
        return this.state.wallet.signTx(actualData.nftSale.transactionCbor, true);
      })
      .then((signedTx) => {
        console.log("Signed Tx:", signedTx)
        
        fetch(`https://localhost:5001/api/transaction/sign`,
        {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ witness: signedTx, nftSaleId: this.state.nftSale.id })
        })
        .then((response) => response.json())
        .then((json) => {
          return this.state.wallet.submitTx(json.nftSale.transactionCbor);
        })
        .then((tx) => {
          console.log(tx);
          this.setState({...this.state, nftSale: null});
        })
        .catch(e => {
          console.log(e);
            this.setState({...this.state, nftSale: null});
        });
      })
      .catch(e => {
          console.log(e);
      });
  }
  
  render(){ 
    return (
      <div className="bg-slate-300 font-sans leading-normal tracking-normal">
          <nav className="bg-gray-800 p-2 mt-0 w-full">
            <div className="container mx-auto flex flex-wrap items-center">
              <div className="flex w-full md:w-1/2 justify-center md:justify-start text-white font-extrabold">
                <a className="text-white no-underline hover:text-white hover:no-underline" href="#">
                  <ConnectWalletButton
                    className="flex flex-row-reverse"
                    onConnect={(w) => this.handleConnect(w)}
                  />
                </a>
              </div>
            </div>
          </nav>

          <div className="container mx-auto flex flex-col md:flex-row items-center my-12 md:my-24">
            <div className="flex flex-row w-full justify-center items-start pt-12 pb-24 px-6">
              
              {this.state.isFetching 
                ? 'Fetching NFTs...' 
                : this.state.nftsToSell.map((nft) => {
                    return <Card key={nft.rarity} name={nft.name} rarity={nft.rarity} imageUrl={nft.imageUrl} cost={nft.baseCost} buy={(r) => this.buyNft(r)} />
              })}

            </div>
          </div>

      </div>
    )
  }
}

export default App;
