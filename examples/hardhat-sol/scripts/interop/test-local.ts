import { send } from './send-message';
import { testOnchainVerification } from './test-onchain-verification';

async function main() {
  await send();
  await testOnchainVerification();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
