import React from 'react'
import styles from './FinalResultSection.module.css'
import { LeaderboardRecord } from '../../types/leaderboard'
import { Avatar, Box, Divider, Tooltip, Typography } from '@mui/material'
import { checkLengthTeam } from '../../utils/function'
import trophy1 from '../../assets/trophy1.png'
import trophy2 from '../../assets/trophy2.png'
import trophy3 from '../../assets/trophy3.png'
interface LeaderboardCardProps {
  leaderboardData: LeaderboardRecord | null
  loading: boolean
}

export function FinalResultSection({ leaderboardData, loading }: LeaderboardCardProps) {
  return (
    <Box
      className={styles['card-container']}
      sx={{
        visibility: !loading ? 'hidden' : 'visible',
        opacity: !loading ? 0 : 1
      }}
    >
      {/* CARD TOP 2 */}
      <Box
        className={styles[leaderboardData?.teamsTop2?.length === 0 ? 'card-wrapper2-nothover' : 'card-wrapper2']}
        style={{
          opacity: leaderboardData?.teamsTop2?.length === 0 ? 0.4 : 1
        }}
      >
        {/* POSITION */}
        <Typography className={styles['position-label2']}>2</Typography>
        {/* TROPHY */}
        <Avatar className={styles['trophy-wrapper2']} src={trophy2.src} />
        {/* TEAM NAME */}
        {leaderboardData?.teamsTop2?.map((team) => (
          <Typography key={team.teamId} className={styles['team-name2']}>
            <Tooltip title={`${team.teamName}`} placement="left">
              <span> {checkLengthTeam(team.teamName)}</span>
            </Tooltip>
          </Typography>
        ))}
        {/* DETAIL */}
        <Box className={styles['detail-container2']}>
          <Box className={styles['detail-wrapper2']}>
            <Typography className={styles['detail-label2']}>Goal Difference</Typography>
            <Typography className={styles['detail-value2']}>{leaderboardData?.teamsTop2[0]?.goalDifference}</Typography>
          </Box>
          <Divider />
          <Box className={styles['detail-wrapper2']}>
            <Typography className={styles['detail-label2']}>Goals For</Typography>
            <Typography className={styles['detail-value2']}>{leaderboardData?.teamsTop2[0]?.goalsFor}</Typography>
          </Box>
          <Divider />
          <Box className={styles['detail-wrapper2']}>
            <Typography className={styles['detail-label2']}>Goals Against</Typography>
            <Typography className={styles['detail-value2']}>{leaderboardData?.teamsTop2[0]?.goalsAgainst}</Typography>
          </Box>
        </Box>
        <Box className={styles['point-container']}>
          <Typography className={styles['point-value2']}>{leaderboardData?.teamsTop2[0]?.score}</Typography>
          <Typography className={styles['point-label2']}>POINTS:</Typography>
        </Box>
      </Box>
      {/* CARD TOP 2 */}
      <Box
        className={styles[leaderboardData?.teamsTop1?.length === 0 ? 'card-wrapper1-nothover' : 'card-wrapper1']}
        style={{
          opacity: leaderboardData?.teamsTop1?.length === 0 ? 0.4 : 1
        }}
      >
        {/* POSITION */}
        <Typography className={styles['position-label1']}>1</Typography>
        {/* CROWN */}
        <Avatar
          className={styles['crown-wrapper']}
          src={
            'https://images.vexels.com/media/users/3/235462/isolated/preview/a14a3501e63681ff7dfcfbafc89c1b96-simple-flat-golden-crown.png'
          }
        />
        {/* TROPHY */}
        <Avatar className={styles['trophy-wrapper1']} src={trophy1.src} />
        {/* TEAM NAME */}
        {leaderboardData?.teamsTop1?.map((team) => (
          <Typography key={team.teamId} className={styles['team-name1']}>
            <Tooltip title={`${team.teamName}`} placement="left">
              <span> {checkLengthTeam(team.teamName)}</span>
            </Tooltip>
          </Typography>
        ))}
        {/* DETAIL */}
        <Box className={styles['detail-container1']}>
          <Box className={styles['detail-wrapper1']}>
            <Typography className={styles['detail-label1']}>Goal Difference</Typography>
            <Typography className={styles['detail-value1']}>{leaderboardData?.teamsTop1[0]?.goalDifference}</Typography>
          </Box>
          <Divider />
          <Box className={styles['detail-wrapper1']}>
            <Typography className={styles['detail-label1']}>Goals For</Typography>
            <Typography className={styles['detail-value1']}>{leaderboardData?.teamsTop1[0]?.goalsFor}</Typography>
          </Box>
          <Divider />
          <Box className={styles['detail-wrapper1']}>
            <Typography className={styles['detail-label1']}>Goals Against</Typography>
            <Typography className={styles['detail-value1']}>{leaderboardData?.teamsTop1[0]?.goalsAgainst}</Typography>
          </Box>
        </Box>
        <Box className={styles['point-container']}>
          <Typography className={styles['point-value1']}>{leaderboardData?.teamsTop1[0]?.score}</Typography>
          <Typography className={styles['point-label1']}>POINTS:</Typography>
        </Box>
      </Box>
      {/* CARD TOP 3 */}
      <Box
        className={styles[leaderboardData?.teamsTop3?.length === 0 ? 'card-wrapper3-nothover' : 'card-wrapper3']}
        style={{
          opacity: leaderboardData?.teamsTop3?.length === 0 ? 0.4 : 1
        }}
      >
        {/* POSITION */}
        <Typography className={styles['position-label3']}>3</Typography>
        {/* TROPHY */}
        <Avatar className={styles['trophy-wrapper3']} src={trophy3.src} />
        {/* TEAM NAME */}
        {leaderboardData?.teamsTop3?.map((team) => (
          <Typography key={team.teamId} className={styles['team-name3']}>
            <Tooltip title={`${team.teamName}`} placement="right">
              <span> {checkLengthTeam(team.teamName)}</span>
            </Tooltip>
          </Typography>
        ))}
        {/* DETAIL */}
        <Box className={styles['detail-container3']}>
          <Box className={styles['detail-wrapper3']}>
            <Typography className={styles['detail-label3']}>Goal Difference</Typography>
            <Typography className={styles['detail-value3']}>{leaderboardData?.teamsTop3[0]?.goalDifference}</Typography>
          </Box>
          <Divider />
          <Box className={styles['detail-wrapper3']}>
            <Typography className={styles['detail-label3']}>Goals For</Typography>
            <Typography className={styles['detail-value3']}>{leaderboardData?.teamsTop3[0]?.goalsFor}</Typography>
          </Box>
          <Divider />
          <Box className={styles['detail-wrapper3']}>
            <Typography className={styles['detail-label3']}>Goals Against</Typography>
            <Typography className={styles['detail-value3']}>{leaderboardData?.teamsTop3[0]?.goalsAgainst}</Typography>
          </Box>
        </Box>
        <Box className={styles['point-container']}>
          <Typography className={styles['point-value3']}>{leaderboardData?.teamsTop3[0]?.score}</Typography>
          <Typography className={styles['point-label3']}>POINTS:</Typography>
        </Box>
      </Box>
    </Box>
  )
}
