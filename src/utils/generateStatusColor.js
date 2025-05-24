export default function generateStatusColor(status) {
  switch (status) {
    case 1:
      return '#FFA500';
    case 2:
      return '#FF0000';
    case 4:
      return '#FFA500';

    default:
      break;
  }
}
