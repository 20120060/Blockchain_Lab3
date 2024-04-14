// timestampFormatter.js

// Function to format a timestamp to dd/mm/yyyy h:m:s
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000); // Convert seconds to milliseconds

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${hours}:${minutes}:${seconds}`;

  return `${formattedDate} ${formattedTime}`;
};

export const TimestampToTime = (timestamp) => {
  const date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  return `${hours}:${minutes}:${seconds}`;
}
