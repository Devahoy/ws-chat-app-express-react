/* eslint-disable react/prop-types */
const FriendList = ({ friends }) => {
  return (
    <div id="chat-friend-list">
      <h3>Friends</h3>

      {friends.map((friend) => (
        <p key={friend.id}>
          {friend.name} <span className={`status-${friend.status}`}></span>
        </p>
      ))}
    </div>
  )
}

export default FriendList
