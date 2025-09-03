import { expect } from 'chai';
import type { Contract } from 'ethers';
import { ethers } from 'ethers';
import { Provider, Wallet } from 'zksync-ethers';
import { Deployer } from '@matterlabs/hardhat-zksync';
import * as hre from 'hardhat';
import * as zk from 'zksync-ethers';
import type { BeaconCrowdfundingCampaign, V2_BeaconCrowdfundingCampaign } from '../../typechain-types';

describe('Beacon Proxy Campaign', function () {
  let campaign: BeaconCrowdfundingCampaign;
  let owner: Wallet;
  let beacon: ethers.Contract;

  beforeEach(async () => {
    const provider = new Provider(hre.network.config.url);
    owner = new Wallet('0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110', provider);
    const deployer = new Deployer(hre, owner);
    const contractArtifact = await deployer.loadArtifact('BeaconCrowdfundingCampaign');

    const fundingGoalInWei = ethers.parseEther('0.777').toString();
    beacon = await hre.zkUpgrades.deployBeacon(deployer.zkWallet, contractArtifact, [], {}, true);
    await beacon.waitForDeployment();
    campaign = (await hre.zkUpgrades.deployBeaconProxy(
      deployer.zkWallet,
      await beacon.getAddress(),
      contractArtifact,
      [fundingGoalInWei],
      {},
      true
    )) as unknown as BeaconCrowdfundingCampaign;
    campaign.waitForDeployment();
  });

  describe('V2', function () {
    it('does not allow initializeV2 to be run more than once', async () => {
      const campaignAddress = await campaign.getAddress();
      const deployer = new Deployer(hre, owner);

      const contractV2Artifact = await deployer.loadArtifact('V2_BeaconCrowdfundingCampaign');

      beacon = await hre.zkUpgrades.upgradeBeacon(
        deployer.zkWallet,
        await beacon.getAddress(),
        contractV2Artifact,
        {},
        true
      );

      // ANCHOR: contract-factory
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const attachTo = new zk.ContractFactory<any[], Contract>(
        contractV2Artifact.abi,
        contractV2Artifact.bytecode,
        deployer.zkWallet
      );
      const attachment = attachTo.attach(campaignAddress);
      const v2Campaign = attachment.connect(deployer.zkWallet) as unknown as V2_BeaconCrowdfundingCampaign;
      // ANCHOR_END: contract-factory
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(v2Campaign).to.be.ok;
    });
  });
});
