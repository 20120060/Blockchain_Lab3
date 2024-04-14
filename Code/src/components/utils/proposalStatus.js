export const getStatusString = (status) => {
  switch (status) {
    case 0:
      return 'Open';
    case 1:
      return 'Rejected';
    case 2:
      return 'Adopted';
    case 3:
      return 'Fail';
    default:
      return 'Unknown Status';
  }
};
export const getStatusColor = (status) => {
  switch (status) {
    case 0:
      return 'white'; // Set color for 'Open'
    case 1:
      return 'red'; // Set color for 'Rejected'
    case 2:
      return 'lightgreen'; // Set color for 'Adopted'
    case 3:
      return 'grey'; // Set color for 'Fail'
    default:
      return 'black'; // Set a default color for unknown status
  }
};
