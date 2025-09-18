import { checkStatus } from './check-status';
import { checkInteropRoot } from './check-interop-root';
import { getVerificationArgs } from './get-verification-args';
import { verify } from './verify-message';

async function main() {
  await checkStatus();
  await checkInteropRoot();
  await getVerificationArgs();
  await verify();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
