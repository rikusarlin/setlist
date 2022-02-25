import React from 'react'
import { Table } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'

const UserNoHistory = (props) => {
  if ( props.user === undefined){
    props.history.push('/blogs')
    return <div/>
  }

  const blogList = props.user.blogs.map(blog =>
    <tr key={blog.id}><td>{blog.title}</td></tr>
  )

  return (
    <div>
      <h2>{props.user.name}</h2>
      <h3>added blogs</h3>
      <Table striped>
        <tbody>
          {blogList}
        </tbody>
      </Table>
    </div>
  )
}

const User = withRouter(UserNoHistory)

export default User
