import React from 'react'
import UserInfo from './UserInfo'
import ChatList from './ChatList'

const List = () => {
  return (
    <div className='flex-col flex-[1] justify-center '>
      <UserInfo/>
      <ChatList/>
    </div>
  )
}

export default List