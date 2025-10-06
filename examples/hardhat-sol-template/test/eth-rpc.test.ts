import { expect } from 'chai';

describe('Greeter', function () {
  const RPC_URL = 'https://zksync-os-testnet-alpha.zksync.dev/';

  it('Should get the chainId', async function () {
    // ANCHOR: eth_chainId
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_chainId',
        params: [],
      }),
    });
    // ANCHOR_END: eth_chainId

    const data = await response.json();
    expect(data.result).to.equal('0x7a6b31');
  });

  it('Should send a call', async function () {
    // ANCHOR: eth_call
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_call',
        params: [
          {
            to: '0xCA1386680bfd9D89c7cc6Fc3ba11938ba6E44fef',
            data: '0x8381f58a',
          },
          'latest',
        ],
      }),
    });
    // ANCHOR_END: eth_call

    const data = await response.json();
    expect(data.result).to.include('0x00');
  });

  it('Should estimate gas', async function () {
    // ANCHOR: eth_estimateGas
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_estimateGas',
        params: [
          {
            to: '0xCA1386680bfd9D89c7cc6Fc3ba11938ba6E44fef',
            data: '0x8381f58a',
          },
          'latest',
        ],
      }),
    });
    // ANCHOR_END: eth_estimateGas

    const data = await response.json();
    expect(data.result).to.include('0x');
  });

  it('Should get gas price', async function () {
    // ANCHOR: eth_gasPrice
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_gasPrice',
        params: [
          {
            to: '0xCA1386680bfd9D89c7cc6Fc3ba11938ba6E44fef',
            data: '0x8381f58a',
          },
          'latest',
        ],
      }),
    });
    // ANCHOR_END: eth_gasPrice

    const data = await response.json();
    expect(data.result).to.include('0x');
  });

  it('Should make a new filter', async function () {
    // ANCHOR: eth_newFilter
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_newFilter',
        params: [
          {
            fromBlock: 'latest',
            address: '0x8e882b31Fe1d3942c57408D354E754d1659400a7',
            topics: ['0x51af157c2eee40f68107a47a49c32fbbeb0a3c9e5cd37aa56e88e6be92368a81'],
          },
        ],
      }),
    });
    // ANCHOR_END: eth_newFilter

    const data = await response.json();
    expect(data.result).to.include('0x');
  });

  it('Should make a new block filter', async function () {
    // ANCHOR: eth_newBlockFilter
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_newBlockFilter',
        params: [],
      }),
    });
    // ANCHOR_END: eth_newBlockFilter

    const data = await response.json();
    expect(data.result).to.include('0x');
  });

  it('Should uninstall a filter', async function () {
    // ANCHOR: eth_uninstallFilter
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_uninstallFilter',
        params: ['0x944be15c01160f64049f60391297a456'],
      }),
    });
    // ANCHOR_END: eth_uninstallFilter

    const data = await response.json();
    expect(data.result).to.equal(false);
  });

  it('Should set up a pending txn notificaton filter', async function () {
    // ANCHOR: eth_newPendingTransactionFilter
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_newPendingTransactionFilter',
        params: [],
      }),
    });
    // ANCHOR_END: eth_newPendingTransactionFilter

    const data = await response.json();
    expect(data.result).to.include('0x');
  });

  it('Should get logs', async function () {
    // ANCHOR: eth_getLogs
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getLogs',
        params: [
          {
            fromBlock: '0x0',
            address: '0x8e882b31Fe1d3942c57408D354E754d1659400a7',
            topics: ['0x51af157c2eee40f68107a47a49c32fbbeb0a3c9e5cd37aa56e88e6be92368a81'],
          },
        ],
      }),
    });
    // ANCHOR_END: eth_getLogs

    const data = await response.json();
    expect(data.result).to.be.an('array');
  });

  it('Should get filter logs', async function () {
    // ANCHOR: eth_getFilterLogs
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getFilterLogs',
        params: ['0x68fa0ce8614306a7ed7420f3c6cc954'],
      }),
    });
    // ANCHOR_END: eth_getFilterLogs

    const data = await response.json();
    // console.log('data', data);
    expect(data.error.message).to.equal('filter not found');
  });

  it('Should get filter changes', async function () {
    // ANCHOR: eth_getFilterChanges
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getFilterChanges',
        params: ['0x68fa0ce8614306a7ed7420f3c6cc954'],
      }),
    });
    // ANCHOR_END: eth_getFilterChanges

    const data = await response.json();
    // console.log('data', data);
    expect(data.error.message).to.equal('filter not found');
  });

  it('Should get the balance of a wallet', async function () {
    // ANCHOR: eth_getBalance
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getBalance',
        params: ['0xA5Fb4293fe4EEbbc0b7946c4D61B85fd75C4abb8'],
      }),
    });
    // ANCHOR_END: eth_getBalance

    const data = await response.json();
    // console.log('data', data);
    expect(data.result).to.include('0x');
  });

  it('Should get a block by its number', async function () {
    // ANCHOR: eth_getBlockByNumber
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getBlockByNumber',
        params: ['0x347', false],
      }),
    });
    // ANCHOR_END: eth_getBlockByNumber

    const data = await response.json();
    // console.log('data', data);
    expect(data.result.hash).to.include('0x');
  });

  it('Should get a block by its hash', async function () {
    // ANCHOR: eth_getBlockByHash
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getBlockByHash',
        params: ['0x3ac874d9c110eb0979a9c8f545cfd98dd80283a266252a8c9479188e5b40a667', false],
      }),
    });
    // ANCHOR_END: eth_getBlockByHash

    const data = await response.json();
    // console.log('data', data);
    expect(data.result.hash).to.include('0x');
  });

  it('Should get the txn count of a block by number', async function () {
    // ANCHOR: eth_getBlockTransactionCountByNumber
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getBlockTransactionCountByNumber',
        params: ['0x347'],
      }),
    });
    // ANCHOR_END: eth_getBlockTransactionCountByNumber

    const data = await response.json();
    // console.log('data', data);
    expect(data.result).to.include('0x');
  });

  it('Should get block receipts', async function () {
    // ANCHOR: eth_getBlockReceipts
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getBlockReceipts',
        params: ['0x347'],
      }),
    });
    // ANCHOR_END: eth_getBlockReceipts

    const data = await response.json();
    // console.log('data', data);
    expect(data.result).to.be.an('array');
  });

  it('Should get the txn count of a block by hash', async function () {
    // ANCHOR: eth_getBlockTransactionCountByHash
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getBlockTransactionCountByHash',
        params: ['0x3ac874d9c110eb0979a9c8f545cfd98dd80283a266252a8c9479188e5b40a667'],
      }),
    });
    // ANCHOR_END: eth_getBlockTransactionCountByHash

    const data = await response.json();
    // console.log('data', data);
    expect(data.result).to.include('0x');
  });

  it('Should get code', async function () {
    // ANCHOR: eth_getCode
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getCode',
        params: ['0x8e882b31Fe1d3942c57408D354E754d1659400a7'],
      }),
    });
    // ANCHOR_END: eth_getCode

    const data = await response.json();
    // console.log('data', data);
    expect(data.result).to.include('0x');
  });

  it('Should get storage at position', async function () {
    // ANCHOR: eth_getStorageAt
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getStorageAt',
        params: ['0x8e882b31Fe1d3942c57408D354E754d1659400a7', '0x0', 'latest'],
      }),
    });
    // ANCHOR_END: eth_getStorageAt

    const data = await response.json();
    // console.log('data', data);
    expect(data.result).to.include('0x');
  });

  it('Should get the txn count of an address', async function () {
    // ANCHOR: eth_getTransactionCount
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getTransactionCount',
        params: ['0xA5Fb4293fe4EEbbc0b7946c4D61B85fd75C4abb8'],
      }),
    });
    // ANCHOR_END: eth_getTransactionCount

    const data = await response.json();
    // console.log('data', data);
    expect(data.result).to.include('0x');
  });

  it('Should get a txn by hash', async function () {
    // ANCHOR: eth_getTransactionByHash
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getTransactionByHash',
        params: ['0xf0fa4ebfe0eed239fae2854b4ed44f4e1d61d8b37bebf88f419cc01153aa13f1'],
      }),
    });
    // ANCHOR_END: eth_getTransactionByHash

    const data = await response.json();
    // console.log('data', data);
    expect(data.result.value).to.equal('0x0');
  });

  it('Should get a txn by block hash and index', async function () {
    // ANCHOR: eth_getTransactionByBlockHashAndIndex
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getTransactionByBlockHashAndIndex',
        params: ['0x3ac874d9c110eb0979a9c8f545cfd98dd80283a266252a8c9479188e5b40a667', '0x0'],
      }),
    });
    // ANCHOR_END: eth_getTransactionByBlockHashAndIndex

    const data = await response.json();
    // console.log('data', data);
    expect(data.result.value).to.equal('0x0');
  });

  it('Should get a txn receipt', async function () {
    // ANCHOR: eth_getTransactionReceipt
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getTransactionReceipt',
        params: ['0xf0fa4ebfe0eed239fae2854b4ed44f4e1d61d8b37bebf88f419cc01153aa13f1'],
      }),
    });
    // ANCHOR_END: eth_getTransactionReceipt

    const data = await response.json();
    // console.log('data', data);
    expect(data.result.blockNumber).to.equal('0x1736');
  });

  it('Should get the protocol version', async function () {
    // ANCHOR: eth_protocolVersion
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_protocolVersion',
        params: [],
      }),
    });
    // ANCHOR_END: eth_protocolVersion

    const data = await response.json();
    // console.log('data', data);
    expect(data.result).to.include('zksync_os');
  });

  it('Should sent a raw txn', async function () {
    // ANCHOR: eth_sendRawTransaction
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_sendRawTransaction',
        params: ['0xf86c808504a817c80082520894095e7baea6a6c7c4c2dfeb977efac326af552d870a868e8...'],
      }),
    });
    // ANCHOR_END: eth_sendRawTransaction

    const data = await response.json();
    // console.log('data', data);
    expect(data.error.data).to.include('invalid value');
  });

  it('Should get accounts', async function () {
    // ANCHOR: eth_accounts
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_accounts',
        params: [],
      }),
    });
    // ANCHOR_END: eth_accounts

    const data = await response.json();
    // console.log('data', data);
    expect(data.result).to.be.an('array');
  });

  it('Should get fee history', async function () {
    // ANCHOR: eth_feeHistory
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_feeHistory',
        params: ['10', '0x100', [25.0, 50.0, 75.0]],
      }),
    });
    // ANCHOR_END: eth_feeHistory

    const data = await response.json();
    // console.log('data', data);
    expect(data.result.baseFeePerGas).to.be.an('array');
  });
});
