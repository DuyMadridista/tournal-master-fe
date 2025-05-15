import { LeaderboardRecord } from '../types/leaderboard'

export const convertLeaderboardRecord = (original: LeaderboardRecord): LeaderboardRecord => {

  console.log(original)
  if (original.leaderBoard?.length !== 0 && original.leaderBoard?.[0]?.score !== 0) {
    original.started = true
  } else {
    original.started = false
  }
  original.teamsTop1 = []
  original.teamsTop2 = []
  original.teamsTop3 = []
  for (const team of original.leaderBoard) {
    if (original.started) {
      if (team.rank === 1) {
        original.teamsTop1.push(team)
      } else if (team.rank === 2) {
        original.teamsTop2.push(team)
      } else if (team.rank === 3) {
        original.teamsTop3.push(team)
      }
    }
    const matchList = []
    for (const match of original.matches) {
      if ((match.teamOneId === team.teamId || match.teamTwoId === team.teamId) && match.teamWinId !== -1) {
        matchList.push(match)
      }
    }
    // team.totalMatches = matchList.length
    if (matchList.length < 5) {
      while (matchList.length < 5) {
        matchList.push({
          matchId: -1,
          teamOneId: -1,
          teamOneName: '',
          teamTwoId: -1,
          teamTwoName: '',
          teamOneResult: -1,
          teamTwoResult: -1,
          date: '',
          startTime: '',
          endTime: '',
          teamWinId: -1
        })
      }
    } else if (matchList.length > 5) {
      matchList.splice(5)
    }
    team.last5 = matchList
  }

  return {
    started: original.started,
    teamsTop1: original.teamsTop1,
    teamsTop2: original.teamsTop2,
    teamsTop3: original.teamsTop3,
    leaderBoard: original.leaderBoard,
    matches: original.matches
  }
}
export const convertGroupStageLeaderboardRecord = (original: any): LeaderboardRecord => {
  console.log(original)
  for (const team of original.leaderBoard) {
    const matchList = []
    for (const match of original.matches) {
      if ((match.teamOneId === team.teamId || match.teamTwoId === team.teamId) && match.teamWinId !== -1) {
        matchList.push(match)
      }
    }
    if (matchList.length < 5) {
      while (matchList.length < 5) {
        matchList.push({
          matchId: -1,
          teamOneId: -1,
          teamOneName: '',
          teamTwoId: -1,
          teamTwoName: '',
          teamOneResult: -1,
          teamTwoResult: -1,
          date: '',
          startTime: '',
          endTime: '',
          teamWinId: -1
        })
      }
    } else if (matchList.length > 5) {
      matchList.splice(5)
    }
    team.last5 = matchList
  }
  return {
    started: original.started,
    teamsTop1: original.topTeams?.[0] ? [original.topTeams[0]] : [],
    teamsTop2: original.topTeams?.[1] ? [original.topTeams[1]] : [],
    teamsTop3: original.topTeams?.[2] ? [original.topTeams[2]] : [],
    leaderBoard: original.leaderBoard,
    matches: original.matches
  }
}