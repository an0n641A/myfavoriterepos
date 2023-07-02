import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#232629',
    marginHorizontal: 12,
    marginVertical: 5,
    borderRadius: 6,
    flexDirection: 'row',
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  leftColumn: {
    flex: 5,
    marginRight: 15,
  },
  rightColumn: {
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    color: 'white',
    fontWeight: '400',
  },
  header: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stargazers: {
    flexDirection: 'row',
  },
  icon: {
    marginRight: 4,
  },
  largeIcon: {
    marginTop: 7,
  },
  description: {
    marginBottom: 6,
  },
});

export default styles;
