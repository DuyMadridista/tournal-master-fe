import React from 'react'
import styles from './LeaderboardTable.module.css'
import { LeaderboardRecord } from '../../../types/leaderboard'
import {
  Box,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'
import noItem from '../../../assets/noItem.png'
import styled from '@emotion/styled'
import { Last5Tooltip } from './Last5Tooltip/Last5Tooltip'
interface LeaderboardCardProps {
  leaderboardData: LeaderboardRecord | null
  loading: boolean
}

export function LeaderboardTable({ leaderboardData, loading }: LeaderboardCardProps) {
  const columnsLeaderboard = [
    {
      id: 'pos',
      label: 'POS',
      style: {
        left: false,
        filed: 'Position',
        width: '40px'
      }
    },
    {
      id: 'team',
      label: 'TEAM',
      style: {
        left: true,
        filed: 'Team',
        width: '800px'
      }
    },
    {
      id: 'played',
      label: 'MP',
      style: {
        left: false,
        filed: 'Match Played',
        width: '70px'
      }
    },
    {
      id: 'goalsFor',
      label: 'GF',
      style: {
        left: false,
        filed: 'Goals For',
        width: '70px'
      }
    },
    {
      id: 'goalsAgainst',
      label: 'GA',
      style: {
        left: false,
        filed: 'Goals Against',
        width: '70px'
      }
    },
    {
      id: 'goalDifference',
      label: 'GD',
      style: {
        left: false,
        filed: 'Goal Difference',
        width: '70px'
      }
    },
    {
      id: 'point',
      label: 'PTS',
      style: {
        left: false,
        filed: 'Points',
        width: '70px'
      }
    },
    {
      id: 'last5',
      label: 'LAST 5 MATCHES',
      style: {
        left: false,
        filed: 'Last 5 Matches',
        width: '400px'
      }
    }
  ]

  const StyledTableRow = styled(TableRow)(() => ({
    '&:nth-of-type(even)': {
      backgroundColor: '#f9fafd'
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0
    }
  }))
  // Loading skeleton
  const TableRowsLoader = ({ rowsNum }: any) => {
    return (
      <>
        {[...Array(rowsNum)].map((row, index) => (
          <TableRow key={index}>
            {columnsLeaderboard.map((item, index) => (
              <TableCell component="th" scope="row" key={index}>
                <Skeleton animation="wave" variant="text" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </>
    )
  }
  return (
    <TableContainer component={Paper} sx={{ maxHeight: '535px' }}>
      <Table size="small" sx={{ minWidth: 650, position: 'relative' }}>
        <TableHead
          style={{
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            KhtmlUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            userSelect: 'none',
            position: 'relative'
          }}
        >
          <TableRow
            sx={{
              background: ' linear-gradient(195deg, #3562A6, #0E1E5B)',
              position: 'sticky',
              top: 0,
              zIndex: 1002
            }}
          >
            {columnsLeaderboard.map((column) => (
              <TableCell
                className={styles['table-header-cell']}
                key={column.id}
                style={{ width: `${column.style.width}`, textAlign: `${column.style.left ? 'left' : 'center'}` }}
                sx={{
                  padding: column.style.left ? '6px 16px !important' : '0 !important'
                }}
              >
                <Tooltip title={`${column.style.filed}`} placement="top">
                  <span>{column.label}</span>
                </Tooltip>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading ? (
            // LOADING
            <TableRowsLoader rowsNum={10} />
          ) : leaderboardData?.leaderBoard?.length === 0 ? (
            // NO ITEM
            <TableRow>
              <TableCell colSpan={columnsLeaderboard?.length + 1}>
                <Box className={styles['noitem-container']}>
                  <Box className={styles['noitem-wrapper']} component="img" src={noItem.src} alt="no-item" />
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            // TABLE DATA
            leaderboardData?.leaderBoard.map((row, index) => (
              <StyledTableRow key={index}>
                {/* POSITION */}
                <TableCell className={styles['position-cell']} align="center">
                  {index === 0 ? (
                    <>
                      <Box
                        className={styles['position-indicator']}
                        style={{
                          backgroundColor: '#ffe72d'
                        }}
                      ></Box>
                      <Typography variant="body2" align="center" className={styles['position-value']}>
                        <Tooltip title={`${index + 1}`} placement="right">
                          <span>{index + 1}</span>
                        </Tooltip>
                      </Typography>
                    </>
                  ) : index === 1 ? (
                    <>
                      <Box
                        className={styles['position-indicator']}
                        style={{
                          backgroundColor: '#427D9D'
                        }}
                      ></Box>
                      <Typography variant="body2" align="center" className={styles['position-value']}>
                        <Tooltip title={`${index + 1}`} placement="right">
                          <span>{index + 1}</span>
                        </Tooltip>
                      </Typography>
                    </>
                  ) : index === 2 ? (
                    <>
                      <Box
                        className={styles['position-indicator']}
                        style={{
                          backgroundColor: '#f6945a'
                        }}
                      ></Box>
                      <Typography variant="body2" align="center" className={styles['position-value']}>
                        <Tooltip title={`${index + 1}`} placement="right">
                          <span>{index + 1}</span>
                        </Tooltip>
                      </Typography>
                    </>
                  ) : (
                    <Tooltip title={`${index + 1}`} placement="right">
                      <span>{index + 1}</span>
                    </Tooltip>
                  )}
                </TableCell>
                {/* TEAM NAME */}
                <TableCell align="left" className={styles['teamname-cell']}>
                  <Tooltip title={`${row.teamName}`} placement="right">
                    <span>{row.teamName}</span>
                  </Tooltip>
                </TableCell>
                {/* PLAYED MATCHES */}
                <TableCell align="center" style={{}}>
                  <Tooltip title={`${row.totalMatches}`} placement="right">
                    <span>{row.totalMatches}</span>
                  </Tooltip>
                </TableCell>
                {/* GOALS FOR */}
                <TableCell align="center" style={{}}>
                  <Tooltip title={`${row.goalsFor}`} placement="right">
                    <span>{row.goalsFor}</span>
                  </Tooltip>
                </TableCell>
                {/* GOALS AGAINST */}
                <TableCell align="center" style={{}}>
                  <Tooltip title={`${row.goalsAgainst}`} placement="right">
                    <span>{row.goalsAgainst}</span>
                  </Tooltip>
                </TableCell>
                {/* GOAL DIFF */}
                <TableCell align="center" style={{}}>
                  <Tooltip title={`${row.goalDifference}`} placement="right">
                    <span>{row.goalDifference}</span>
                  </Tooltip>
                </TableCell>
                {/* POINTS */}
                <TableCell align="center" className={styles['point-cell']}>
                  <Tooltip title={`${row.score}`} placement="right">
                    <span>{row.score}</span>
                  </Tooltip>
                </TableCell>
                {/* LAST 5 */}
                <TableCell align="center" style={{}}>
                  <Box className={styles['last5-container']}>
                    {[...row.last5].reverse().map((last5Match, index) => (
                      <Box key={index} className={styles['last5-match-container']}>
                        {/* LAST 5 MATCHES TOOLTIP */}
                        {last5Match.teamWinId !== -1 && <Last5Tooltip last5Match={last5Match} />}
                        {/* LAST 5 ITEMS */}
                        <Box
                          key={index}
                          className={styles['last5-item']}
                          sx={{
                            backgroundColor:
                              row.teamId.toString() === last5Match.teamWinId.toString()
                                ? '#00db74'
                                : last5Match.teamWinId.toString() === '0'
                                  ? '#c3b3c5'
                                  : last5Match.teamWinId.toString() > '0'
                                    ? '#e0005e'
                                    : '#cccccc'
                          }}
                        >
                          <Typography key={index} className={styles['last5-item-text']}>
                            {row.teamId.toString() === last5Match.teamWinId.toString()
                              ? 'W'
                              : last5Match.teamWinId.toString() === '0'
                                ? 'D'
                                : last5Match.teamWinId.toString() > '0'
                                  ? 'L'
                                  : '-'}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </TableCell>
              </StyledTableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
