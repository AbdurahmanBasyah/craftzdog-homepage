export const generateRoomId = () => {
  const id = Math.floor(100000 + Math.random() * 900000).toString()
  return id
}
