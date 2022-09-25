import { useStarknetCall } from '@starknet-react/core'
import type { NextPage } from 'next'
import { useMemo, useState } from 'react'
import { toBN } from 'starknet/dist/utils/number'
import { IncrementCounter } from '~/components/IncrementCounter'
import Layout from '~/components/Layout'
import { TransactionList } from '~/components/TransactionList'
import { useCounterContract } from '~/hooks/counter'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography'

const Home: NextPage = () => {
  const [watch, setWatch] = useState(true)
  const { contract: counter } = useCounterContract()

  const { data: counterResult } = useStarknetCall({
    contract: counter,
    method: 'counter',
    args: [],
    options: { watch },
  })

  const counterValue = useMemo(() => {
    if (counterResult && counterResult.length > 0) {
      const value = toBN(counterResult[0])
      return value.toString(10)
    }
  }, [counterResult])

  return (
    <Layout>
      <Container>
      <h2>Counter Contract</h2>
      <Typography noWrap>
        Address: {counter?.address}
      </Typography>
      <p>Value: {counterValue}</p>
      <p>
        <span>
          Refresh value at every block{' '}
          <input type="checkbox" checked={watch} onChange={(evt) => setWatch(evt.target.checked)} />
        </span>
      </p>
      <IncrementCounter />
      <h2>Recent Transactions</h2>
      <TransactionList />
      </Container>
    </Layout>
  )
}

export default Home
