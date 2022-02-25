import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchUsers } from '../reducers/userReducer'
import { connect } from 'react-redux'
import { Table } from 'react-bootstrap'


export const Users = (props) => {
  var user=props.user.username
  var getUsers = props.fetchUsers
  useEffect(() => {
    getUsers()
  }, [user, getUsers])

  // const filteredBlogs = blogs.filter(blog => blog.author.toUpperCase().indexOf(filterValue.toUpperCase()) >= 0)
  //console.log("props.users: ",props.users)
  if(props.users !== null){
    const sortedUsers = props.users.sort((a,b) => b.name - a.name )
    const userList = sortedUsers.map(user =>
      <tr key={user.id}>
        <td className="col-sm-1"><Link to={`/users/${user.id}`}>{user.name}</Link></td>
        <td className="col-sm-2">{ user.blogs.length }</td>
      </tr>
    )
    if(props.user.username !== null){
      return(
        <Table striped>
          <thead>
            <tr><th className="col-sm-1"/><th className="col-sm-2">blogs created</th></tr>
          </thead>
          <tbody>
            {userList}
          </tbody>
        </Table>
      )
    } else {
      return(<div/>)
    }
  } else {
    return (<div>No users found</div>)
  }
}


const mapStateToProps = (state) => {
  return {
    user: state.user,
    users: state.users
  }
}

const mapDispatchToProps = {
  fetchUsers
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Users)
