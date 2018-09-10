import React from 'react'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'
import axios from 'axios'

import Navbar from '../components/Navbar'
import './all.sass'

const TemplateWrapper = ({ data, children }) => {
  return (
    <div>
      <Helmet title="Home | Gatsby + Netlify CMS" />
      <Navbar />
      <button
        onClick={() => {
          // eslint-disable-next-line no-restricted-globals
          if (confirm('Do you want to rebuild this site?')) {
            axios
              .post(
                'https://api.netlify.com/build_hooks/5b96b43e1f12b7476209f370',
                '{}',
              )
              .then(response => {
                console.log(response)
              })
              .catch(error => {
                console.log(error)
              })
          }
        }}
      >
        Build
      </button>
      <div>
        Data from Netlify CMS: <strong>{data.testTest.title}</strong>
      </div>
      <div>{children}</div>
    </div>
  )
}

// export default TemplateWrapper

export default props => (
  <StaticQuery
    query={graphql`
      query LayoutQuery {
        testTest {
          id
          title
        }
      }
    `}
    render={data => <TemplateWrapper {...{ data, ...props }} />}
  />
)
