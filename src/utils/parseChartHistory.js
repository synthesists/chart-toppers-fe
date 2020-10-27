import response from '../streaks'

response.tracks = response.tracks.map((track) => ({ ...track, isMostPopularAt: new Set(track.isMostPopularAt) }))

const randomColourGenerator = () => `rgba(${Math.random() * 64 + 96}, ${Math.random() * 128 + 128}, ${Math.random() * 128 + 128}, 0.7)`

const createDatasetFromStreak = ({ startDate, positions, weekOffset }, id) => {
  const data = positions.map((position, x) => ({ x: x + weekOffset, y: position }))
  const colour = randomColourGenerator()
  return {
    label: `${id}-${startDate}`,
    fill: 'start',
    borderColor: colour,
    backgroundColor: [colour, randomColourGenerator()],
    showLine: true,
    data,
  }
}

export const datasets = response.tracks.flatMap(track => track.streaks.map(streak => createDatasetFromStreak(streak, track.id)))


const NUMBER_OF_VISIBLE_WEEKS = 20;
const streakIsVisible = ({ weekOffset, positionsLength }, currentWeek, lastWeek) => {
  return (weekOffset < lastWeek && weekOffset + positionsLength > currentWeek)
}

export const getVisibleTracks = (currentWeek) => {
  const firstVisibleWeek = currentWeek - NUMBER_OF_VISIBLE_WEEKS;

  return response.tracks.filter(({ streaks }) => streaks.some((streak) => streakIsVisible(streak, firstVisibleWeek, currentWeek)))
}

export const getMostPopularTrack = (currentWeek) => {
  return response.tracks.find((track) => track.isMostPopularAt.has(currentWeek))
}
