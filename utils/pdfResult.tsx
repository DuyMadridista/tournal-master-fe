import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer'
import moment from 'moment'

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35
  },
  title: {
    fontSize: 26,
    textAlign: 'center'
  },
  date: {
    fontSize: 18,
    margin: 12,
    textAlign: 'center'
  },
  text: {
    fontSize: 11,
    textAlign: 'justify'
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
    width: 100,
    height: 100
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey'
  },
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingBottom: 5,
    borderBottom: '1px solid black'
  },
  timeContainer: {
    marginRight: 10,
    padding: 5
  },
  scoreContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  scoreText: {
    width: 60,
    padding: '5 0',
    textAlign: 'center',
    borderRadius: '5px',
    border: '1px solid black',
    fontSize: 12
  },
  teamNameA: {
    marginRight: 10,
    fontSize: 13,
    flex: 1,
    textAlign: 'right'
  },
  teamNameB: {
    marginRight: 10,
    fontSize: 13,
    flex: 1,
    textAlign: 'left'
  },
  score: {
    margin: '3px 25px 0 15px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 15
  },
  noScore: {
    width: 60,
    height: 25,
    padding: '5 0',
    textAlign: 'center',
    borderRadius: '5px',
    border: '1px solid black',
    fontSize: 12
  },
  category: {
    fontSize: 13,
    marginBottom: 10
  }
})

interface PDFResultProps {
  result: Array<{
    date: string
    matches: Array<{
      startTime: string
      endTime: string
      teamOneName: string
      teamTwoName: string
      teamOneResult: string
      teamTwoResult: string
    }>
  }>
  titleTournament: string
  category: string
  organizer: string
}

const PDFResult: React.FC<PDFResultProps> = ({ result, titleTournament, category, organizer }) => {
  Font.register({
    family: 'Oswald',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
  })

  return (
    <Document>
      {result.map((day, index) => (
        <Page key={index} style={styles.body}>
          <Text style={styles.title}>{titleTournament}</Text>
          <Text style={styles.date}>{moment(day.date).format('dddd, MMMM D, YYYY')}</Text>
          <View
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginTop: '10px'
            }}
          >
            <Text style={styles.category}>Category: {category}</Text>
            <Text style={styles.category}>
              Organizers: {Array.isArray(organizer) ? organizer.join(', ') : organizer}
            </Text>
          </View>
          {day.matches.map((match, matchIndex) => (
            <View key={matchIndex} style={styles.matchContainer}>
              <View style={styles.timeContainer}>
                <Text style={styles.text}>
                  {moment(match.startTime, 'HH:mm:ss').format('HH:mm')}-
                  {moment(match.endTime, 'HH:mm:ss').format('HH:mm')}
                </Text>
              </View>
              <View style={styles.scoreContainer}>
                <Text style={styles.teamNameA}>{match.teamOneName}</Text>
                <View style={styles.score}>
                  {match.teamOneResult ? (
                    <>
                      <Text style={styles.scoreText}>{match.teamOneResult}</Text>
                      <Text>-</Text>
                      <Text style={styles.scoreText}>{match.teamTwoResult}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.noScore}>{match.teamOneResult}</Text>
                      <Text>-</Text>
                      <Text style={styles.noScore}>{match.teamTwoResult}</Text>
                    </>
                  )}
                </View>
                <Text style={styles.teamNameB}>{match.teamTwoName}</Text>
              </View>
            </View>
          ))}
        </Page>
      ))}
    </Document>
  )
}

export default PDFResult
