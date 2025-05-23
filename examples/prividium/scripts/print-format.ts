// Script that prints the funciton signatures
// used in the permissions config

// ANCHOR: function-signature
import ABI_JSON from '../artifacts-zk/contracts/erc20/MyERC20Token.sol/MyERC20Token.json';
import { type AbiFunction, formatAbiItem } from 'abitype';

async function main() {
  const { abi } = ABI_JSON;

  abi.forEach((item) => {
    if (item.type === 'function') {
      const signature = formatAbiItem(item as AbiFunction);
      console.log(signature);
    }
  });
}
// ANCHOR_END: function-signature

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
