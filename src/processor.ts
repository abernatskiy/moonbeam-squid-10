import { TypeormDatabase } from '@subsquid/typeorm-store';
import {EvmBatchProcessor} from '@subsquid/evm-processor'
import { lookupArchive } from '@subsquid/archive-registry'
import assert from 'assert';
import { Burn } from './model';
import * as erc721abi from './abi/erc721'

const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: 'https://v2.archive.subsquid.io/network/moonbeam-mainnet',
    chain: process.env.RPC_MOONBEAM_HTTP
  })
	.setBlockRange({from: 3_720_000})
  .setFinalityConfirmation(0)
  .addLog({
    topic0: [ erc721abi.events.Transfer.topic ],
    transaction: true
	})
/*
  .addTransaction({
    to: ['0x0000000000000000000000000000000000000000'],
    range: {from: 3_700_000}
  })
*/
  .setFields({
    transaction: {
      from: true,
      value: true,
      hash: true
    }
  })

processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {
//  const burns: Burn[] = []
  for (let c of ctx.blocks) {
    console.log(`retrieved ${c.transactions.length} at block ${c.header.height}`)
/*
    for (let txn of c.transactions) {
      // decode and normalize the tx data
      burns.push(new Burn({
        id: txn.id,
        block: c.header.height,
        address: txn.from,
        value: txn.value,
        txHash: txn.hash
      }))
    }
*/
  }
   // apply vectorized transformations and aggregations
//   const burned = burns.reduce((acc, b) => acc + b.value, 0n)/1_000_000_000n
//   const startBlock = ctx.blocks.at(0)?.header.height
//   const endBlock = ctx.blocks.at(-1)?.header.height
//   ctx.log.info(`Burned ${burned} Gwei from ${startBlock} to ${endBlock}`)

   // upsert batches of entities with batch-optimized ctx.store.save
//   await ctx.store.save(burns)
});

