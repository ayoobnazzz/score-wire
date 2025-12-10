import { useSubscription, gql } from '@apollo/client'

const SCORE_UPDATED_SUBSCRIPTION = gql`
  subscription ScoreUpdated($matchId: ID!) {
    scoreUpdated(matchId: $matchId) {
      id
      homeTeam
      awayTeam
      homeScore
      awayScore
      status
    }
  }
`

interface SubscriptionExampleProps {
  matchId: string
}

export default function SubscriptionExample({ matchId }: SubscriptionExampleProps) {
  const { data, loading } = useSubscription(SCORE_UPDATED_SUBSCRIPTION, {
    variables: { matchId },
  })

  if (loading) return <div>Listening for updates...</div>

  return (
    <div>
      {data && (
        <div>
          <p>
            {data.scoreUpdated.homeTeam} {data.scoreUpdated.homeScore} -{' '}
            {data.scoreUpdated.awayScore} {data.scoreUpdated.awayTeam}
          </p>
        </div>
      )}
    </div>
  )
}

