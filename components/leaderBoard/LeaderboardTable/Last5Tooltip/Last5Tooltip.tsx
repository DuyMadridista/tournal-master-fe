import React from 'react'
import styles from './Last5Tooltip.module.css'
import { Box, Tooltip, Typography } from '@mui/material'
import { MatchForLeaderboard } from '../../../../types/leaderboard'
import dayjs from 'dayjs'
import { checkLengthTeam } from '../../../../utils/function'
interface LeaderboardCardProps {
  last5Match: MatchForLeaderboard
}

export function Last5Tooltip({ last5Match }: LeaderboardCardProps) {
  return (
    <Box className={styles['last5-tooltip-container']}>
      <Box className={styles['last5-tooltip-wrapper']}>
        {/* DATE */}
        <Box>
          <Typography className={styles['last5-tooltip-date']}>
            <Tooltip title={`${dayjs(last5Match.date).format('dddd DD MMMM YYYY')}`} placement="top">
              <span>{dayjs(last5Match.date).format('ddd D MMM YYYY')}</span>
            </Tooltip>
          </Typography>
          <Box className={styles['last5-tooltip-date-padding']}></Box>
        </Box>
        {/* SCORE */}
        <Box className={styles['last5-tooltip-score-container']}>
          <Box className={styles['last5-tooltip-score-wrapper']}>
            <Typography
              className={styles['last5-tooltip-score-teamname']}
              style={{
                fontWeight: last5Match.teamWinId === last5Match.teamOneId ? '600' : '400'
              }}
            >
              <Tooltip title={`${last5Match.teamOneName}`} placement="left">
                <span> {checkLengthTeam(last5Match.teamOneName)}</span>
              </Tooltip>
            </Typography>
            <Typography
              className={styles['last5-tooltip-score-value']}
              style={{
                fontWeight: last5Match.teamWinId === last5Match.teamOneId ? '600' : '400'
              }}
            >
              <Tooltip title={`${last5Match.teamOneResult}`} placement="right">
                <span> {last5Match.teamOneResult}</span>
              </Tooltip>
              {last5Match.teamOneId === last5Match.teamWinId && (
                <Box className={styles['last5-tooltip-score-arrow']}></Box>
              )}
            </Typography>
          </Box>
          <Box className={styles['last5-tooltip-score-wrapper']}>
            <Typography
              className={styles['last5-tooltip-score-teamname']}
              style={{
                fontWeight: last5Match.teamWinId === last5Match.teamTwoId ? '600' : '400'
              }}
            >
              <Tooltip title={`${last5Match.teamTwoName}`} placement="left">
                <span> {checkLengthTeam(last5Match.teamTwoName)}</span>
              </Tooltip>
            </Typography>
            <Typography
              className={styles['last5-tooltip-score-value']}
              style={{
                fontWeight: last5Match.teamWinId === last5Match.teamTwoId ? '600' : '400'
              }}
            >
              <Tooltip title={`${last5Match.teamTwoResult}`} placement="right">
                <span> {last5Match.teamTwoResult}</span>
              </Tooltip>
              {last5Match.teamTwoId === last5Match.teamWinId && (
                <Box className={styles['last5-tooltip-score-arrow']}></Box>
              )}
            </Typography>
          </Box>
        </Box>
      </Box>
      {/* TAIL */}
      <Box className={styles['last5-tooltip-tail-wrapper']}>
        <Box className={styles['last5-tooltip-tail']}></Box>
      </Box>
    </Box>
  )
}
