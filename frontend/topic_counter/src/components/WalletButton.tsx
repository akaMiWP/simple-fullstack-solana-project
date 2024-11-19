import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";
import { Text } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";

const WalletButton = () => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletContent />
          {/* <WalletMultiButton />
          {/* <Text>{connected ? "Connected" : "Not Connected"}</Text> */}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletButton;

const WalletContent = () => {
  const { publicKey, connected } = useWallet();

  return (
    <div>
      <WalletMultiButton />
      <Text>
        {connected ? `Connected: ${publicKey?.toBase58()}` : "Not Connected"}
      </Text>
    </div>
  );
};
